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
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { Moment } from 'jalali-moment';
import { CandyDate } from 'ng-zorro-antd/core';

const MAX_ROW = 4;
const MAX_COL = 3;

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  selector: 'month-table',
  exportAs: 'monthTable',
  templateUrl: 'month-table.component.html'
})
export class MonthTableComponent implements OnInit, OnChanges {
  @Input() value: CandyDate = new CandyDate();
  @Input() dateLocale: string;
  @Input() prefixCls: string = 'ant-fullcalendar';
  @Input() monthCellRender: TemplateRef<{ $implicit: Date }>;
  @Input() monthFullCellRender: TemplateRef<{ $implicit: Date }>;
  @Output() readonly valueChange = new EventEmitter<CandyDate>();

  @Input() disabledDate: (date: Moment) => boolean;

  panelMonths: PanelMonthData[][];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.value.setLocale(this.dateLocale);
    if (changes.value || changes.disabledDate) {
      this.render();
    }
  }

  trackYear(_index: number): number {
    return this.value ? this.value.getYear() : _index;
  }

  trackPanelMonth(_index: number, monthData: PanelMonthData): string {
    return monthData.content;
  }

  private render(): void {
    if (this.value) {
      this.panelMonths = this.makePanelMonths();
    }
  }

  private makePanelMonths(): PanelMonthData[][] {
    const months: PanelMonthData[][] = [];
    const currentMonth = this.value.getMonth();
    const today = new CandyDate(new Date(), this.dateLocale);

    let monthValue = 0;
    for (let rowIndex = 0; rowIndex < MAX_ROW; rowIndex++) {
      months[rowIndex] = [];
      for (let colIndex = 0; colIndex < MAX_COL; colIndex++) {
        const month = this.value.clone().setMonth(monthValue);
        const disabled = this.disabledDate ? this.disabledDate(this.value.clone().setMonth(monthValue)._moment) : false;
        const content = month._moment.format('MMM');

        const cell: PanelMonthData = (months[rowIndex][colIndex] = {
          value: month,
          disabled,
          content,
          month: monthValue,
          title: content,
          classMap: null,
          onClick: () => this.chooseMonth(cell.month) // don't use monthValue here
        });

        cell.classMap = {
          [`${this.prefixCls}-month-panel-cell`]: true,
          [`${this.prefixCls}-month-panel-cell-disabled`]: disabled,
          [`${this.prefixCls}-month-panel-selected-cell`]: monthValue === currentMonth,
          [`${this.prefixCls}-month-panel-current-cell`]:
            today.getYear() === this.value.getYear() && monthValue === today.getMonth()
        };

        monthValue++;
      }
    }
    return months;
  }

  private chooseMonth(month: number): void {
    this.value = this.value.clone().setMonth(month);
    this.valueChange.emit(this.value);
    this.render();
  }
}

export interface PanelMonthData {
  disabled: boolean;
  content: string;
  month: number;
  title: string;
  classMap: object | null;
  onClick: VoidFunction | null;
  value: CandyDate;
}
