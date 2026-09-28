import { beginLaunch, finishLaunch } from '../services/smart/smartAuthorizationService.js';
import { config } from '../config/environment.js';
import { randomToken } from '../utils/securityUtils.js';
import { cookieOptions, readCookie, LAUNCH_COOKIE, SESSION_COOKIE } from '../utils/cookieUtils.js';
import { saveSession, deleteSession } from '../repositories/sessionRepository.js';
import { audit } from '../repositories/auditEventRepository.js';

export async function startSmartLaunch(request, response) {
  try {
    const { location, browser } = await beginLaunch(request.query.iss, request.query.launch);
    response.cookie(LAUNCH_COOKIE, browser, cookieOptions(300)).redirect(302, location);
  } catch { response.redirect(302, `${config().appUrl}/?error=launch`); }
}

export async function completeSmartLaunch(request, response) {
  try {
    const value = await finishLaunch(request.query.state, readCookie(request, LAUNCH_COOKIE), request.query.code);
    const id = randomToken();
    await saveSession(id, value);
    await audit(id, 'SMART EHR session opened');
    await deleteSession(readCookie(request, SESSION_COOKIE));
    response.cookie(SESSION_COOKIE, id, cookieOptions(Math.floor((value.expiresAt - Date.now()) / 1000)));
    response.cookie(LAUNCH_COOKIE, '', cookieOptions(0)).redirect(302, config().appUrl);
  } catch {
    response.cookie(LAUNCH_COOKIE, '', cookieOptions(0)).redirect(302, `${config().appUrl}/?error=smart`);
  }
}
