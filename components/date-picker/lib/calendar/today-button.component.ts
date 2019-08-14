/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { Moment } from 'jalali-moment';
import { CandyDate } from 'ng-zorro-antd/core';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/i18n';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  selector: 'today-button',
  exportAs: 'todayButton',
  templateUrl: 'today-button.component.html'
})
export class TodayButtonComponent implements OnInit, OnChanges {
  @Input() locale: NzCalendarI18nInterface;
  @Input() dateLocale: string;
  @Input() hasTimePicker: boolean = false;
  @Input() disabledDate: (d: Moment) => boolean;

  @Output() readonly clickToday = new EventEmitter<CandyDate>();

  prefixCls: string = 'ant-calendar';
  isDisabled: boolean = false;
  title: string;

  private now: CandyDate = new CandyDate(new Date(), this.dateLocale);

  constructor() {}

  ngOnInit(): void {
    this.now = this.now.setLocale(this.dateLocale);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabledDate) {
      this.isDisabled = this.disabledDate && this.disabledDate(this.now._moment);
    }
    if (changes.locale) {
      const dateFormat: string = this.locale.dateFormat;
      this.title = this.now._moment.format(dateFormat);
    }
    if (changes.dateLocale) {
      this.now.setLocale(this.dateLocale);
      const dateFormat: string = this.locale.dateFormat;
      this.title = this.now._moment.format(dateFormat);
    }
  }

  onClickToday(): void {
    this.now = this.now.setLocale(this.dateLocale);
    this.clickToday.emit(this.now.clone()); // To prevent the "now" being modified from outside, we use clone
  }
}
