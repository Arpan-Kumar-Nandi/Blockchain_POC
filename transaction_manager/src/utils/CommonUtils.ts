import crypto from 'node:crypto';

export class CommonUtils {
  generateNonce() {
    return crypto.randomInt(0, 10000);
  }
}
