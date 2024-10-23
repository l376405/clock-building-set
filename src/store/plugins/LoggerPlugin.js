import { logger } from '@/utils/logger'

export function loggerPlugin({ store }) {
  store.$subscribe((mutation, state) => {
    logger.debug(`Store ${store.$id} updated`, {
      type: mutation.type,
      payload: mutation.payload,
      newState: state
    });
  });
}