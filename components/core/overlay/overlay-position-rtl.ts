/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ConnectionPositionPair } from '@angular/cdk/overlay';

export const POSITION_MAP_RTL: { [key: string]: ConnectionPositionPair } = {
  top: new ConnectionPositionPair(
    { originX: 'center', originY: 'top' },
    {
      overlayX: 'center',
      overlayY: 'bottom'
    }
  ),
  topCenter: new ConnectionPositionPair(
    { originX: 'center', originY: 'top' },
    { overlayX: 'center', overlayY: 'bottom' }
  ),
  topLeft: new ConnectionPositionPair(
    { originX: 'end', originY: 'top' },
    {
      overlayX: 'end',
      overlayY: 'bottom'
    }
  ),
  topRight: new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
  right: new ConnectionPositionPair(
    { originX: 'start', originY: 'center' },
    {
      overlayX: 'end',
      overlayY: 'center'
    }
  ),
  rightTop: new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' }),
  rightBottom: new ConnectionPositionPair(
    { originX: 'start', originY: 'bottom' },
    { overlayX: 'end', overlayY: 'bottom' }
  ),
  bottom: new ConnectionPositionPair(
    { originX: 'center', originY: 'bottom' },
    {
      overlayX: 'center',
      overlayY: 'top'
    }
  ),
  bottomCenter: new ConnectionPositionPair(
    { originX: 'center', originY: 'bottom' },
    { overlayX: 'center', overlayY: 'top' }
  ),
  bottomLeft: new ConnectionPositionPair(
    { originX: 'start', originY: 'bottom' },
    { overlayX: 'start', overlayY: 'top' }
  ),
  bottomRight: new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
  left: new ConnectionPositionPair(
    { originX: 'end', originY: 'center' },
    {
      overlayX: 'start',
      overlayY: 'center'
    }
  ),
  leftTop: new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' }),
  leftBottom: new ConnectionPositionPair(
    { originX: 'end', originY: 'bottom' },
    { overlayX: 'start', overlayY: 'bottom' }
  )
};
