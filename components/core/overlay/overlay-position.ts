/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ConnectedOverlayPositionChange, ConnectionPositionPair } from '@angular/cdk/overlay';
import { POSITION_MAP_RTL } from './overlay-position-rtl';

export const POSITION_MAP: { [key: string]: ConnectionPositionPair } = {
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
    { originX: 'start', originY: 'top' },
    {
      overlayX: 'start',
      overlayY: 'bottom'
    }
  ),
  topRight: new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
  right: new ConnectionPositionPair(
    { originX: 'end', originY: 'center' },
    {
      overlayX: 'start',
      overlayY: 'center'
    }
  ),
  rightTop: new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' }),
  rightBottom: new ConnectionPositionPair(
    { originX: 'end', originY: 'bottom' },
    { overlayX: 'start', overlayY: 'bottom' }
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
    { originX: 'start', originY: 'center' },
    {
      overlayX: 'end',
      overlayY: 'center'
    }
  ),
  leftTop: new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' }),
  leftBottom: new ConnectionPositionPair(
    { originX: 'start', originY: 'bottom' },
    { overlayX: 'end', overlayY: 'bottom' }
  )
};

export const DEFAULT_TOOLTIP_POSITIONS = [POSITION_MAP.top, POSITION_MAP.right, POSITION_MAP.bottom, POSITION_MAP.left];
export const DEFAULT_DROPDOWN_POSITIONS = [
  POSITION_MAP.bottomLeft,
  POSITION_MAP.bottomRight,
  POSITION_MAP.topRight,
  POSITION_MAP.topLeft
];
export const DEFAULT_SUBMENU_POSITIONS = [POSITION_MAP.rightTop, POSITION_MAP.leftTop];
export const DEFAULT_CASCADER_POSITIONS = [
  POSITION_MAP.bottomLeft,
  POSITION_MAP.bottomRight,
  POSITION_MAP.topLeft,
  POSITION_MAP.topRight
];
export const DEFAULT_MENTION_POSITIONS = [
  POSITION_MAP.bottomLeft,
  new ConnectionPositionPair(
    {
      originX: 'start',
      originY: 'bottom'
    },
    { overlayX: 'start', overlayY: 'bottom' }
  )
];

export function getPlacementName(
  position: ConnectedOverlayPositionChange,
  direction: 'ltr' | 'rtl' = 'ltr'
): string | undefined {
  const keyList = ['originX', 'originY', 'overlayX', 'overlayY'];
  let positionMap: { [key: string]: ConnectionPositionPair };
  positionMap = POSITION_MAP;
  if (direction === 'rtl') {
    positionMap = POSITION_MAP_RTL;
  }
  console.log(position);
  console.log(positionMap);
  for (const placement in positionMap) {
    console.log('placement in for:' + positionMap[placement]);
    // @ts-ignore
    if (keyList.every(key => position.connectionPair[key] === positionMap[placement][key])) {
      return placement;
    }
  }
}
