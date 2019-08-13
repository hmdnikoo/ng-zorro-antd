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
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import * as momentNs from 'jalali-moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'jalali-moment';
import { isNonEmptyString, isTemplateRef, valueFunctionProp, CandyDate, FunctionProp } from 'ng-zorro-antd/core';
import { DateHelperService, NzCalendarI18nInterface, NzI18nService, WeekDayIndex } from 'ng-zorro-antd/i18n';
const moment = momentNs;

const DATE_ROW_NUM = 6;

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  selector: 'date-table',
  exportAs: 'dateTable',
  templateUrl: 'date-table.component.html'
})
export class DateTableComponent implements OnInit, OnChanges {
  _value: CandyDate;
  headWeekDays: { [key: string]: WeekDayLabel };
  weekRows: WeekRow[];
  objectKeys = Object.keys;

  @Input() prefixCls: string = 'ant-calendar';
  @Input() locale: NzCalendarI18nInterface;
  @Input() dateLocale: string;
  @Input() selectedValue: CandyDate[]; // Range ONLY
  @Input() hoverValue: CandyDate[]; // Range ONLY

  @Input()
  set value(date: CandyDate) {
    this._value = this.activeDate = date;
  }

  get value(): CandyDate {
    return this._value;
  }

  @Input() activeDate: CandyDate;
  @Input() showWeek: boolean = false;
  @Input() disabledDate: (d: CandyDate) => boolean;
  @Input() dateCellRender: FunctionProp<TemplateRef<CandyDate> | string>;
  @Input() dateFullCellRender: FunctionProp<TemplateRef<CandyDate> | string>;
  @Output() readonly dayHover = new EventEmitter<CandyDate>(); // Emitted when hover on a day by mouse enter
  @Output() readonly valueChange = new EventEmitter<CandyDate>();

  isTemplateRef = isTemplateRef;
  isNonEmptyString = isNonEmptyString;
  private readonly DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

  constructor(protected dateHelper: DateHelperService, private i18n: NzI18nService) {}
  ngOnInit(): void {
    this.value._moment.locale(this.dateLocale);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
    if (
      this.isDateRealChange(changes.activeDate) ||
      this.isDateRealChange(changes.value) ||
      this.isDateRealChange(changes.selectedValue) ||
      this.isDateRealChange(changes.hoverValue)
    ) {
      // this.value._moment.locale(this.dateLocale);
      this.render();
    }
  }

  private isDateRealChange(change: SimpleChange): boolean {
    if (change) {
      const previousValue: CandyDate | CandyDate[] = change.previousValue;
      const currentValue: CandyDate | CandyDate[] = change.currentValue;
      if (Array.isArray(currentValue)) {
        return (
          !Array.isArray(previousValue) ||
          currentValue.length !== previousValue.length ||
          currentValue.some((value, index) => !previousValue[index].isSame(value, 'day'))
        );
      } else {
        return !this.isSameDate(previousValue as CandyDate, currentValue);
      }
    }
    return false;
  }

  private isSameDate(left: CandyDate, right: CandyDate): boolean {
    return (!left && !right) || (left && right && right.isSame(left, 'day'));
  }

  private render(): void {
    if (this.value) {
      this.headWeekDays = this.makeHeadWeekDays();
      this.weekRows = this.makeWeekRows();
    }
  }

  private changeValueFromInside(value: CandyDate): void {
    // Only change date not change time
    const newValue = this.value
      .setYear(value.getYear())
      .setMonth(value.getMonth())
      .setDate(value.getDate());
    this.valueChange.emit(newValue);
  }

  generateDaysMap(firstDayOfWeek: WeekDayIndex): { [key: number]: string } {
    const daysArr = this.DAYS.slice(firstDayOfWeek, 7).concat(this.DAYS.slice(0, firstDayOfWeek));
    return daysArr.reduce(
      (map, day, index) => {
        map[index] = day;
        return map;
      },
      {} as { [key: number]: string }
    );
  }
  generateWeekdays(firstDayOfWeek: WeekDayIndex, locale?: string): { [key: string]: Moment } {
    const weekdayNames: { [key: string]: Moment } = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'].reduce(
      (acc, d, i) => {
        const m = moment();
        if (locale) {
          m.locale(locale);
        }
        m.day(i);
        acc[d] = m;
        return acc;
      },
      {} as { [key: string]: Moment }
    );

    const weekdays: { [key: string]: Moment } = {};
    const daysMap = this.generateDaysMap(firstDayOfWeek);

    for (const dayKey in daysMap) {
      if (daysMap.hasOwnProperty(dayKey)) {
        const day = daysMap[dayKey];
        weekdays[day] = weekdayNames[daysMap[Number(dayKey)]];
      }
    }
    return weekdays;
  }
  getWeekdayName(weekday: Moment, format: string = 'dd'): string {
    return weekday.format(format);
  }
  private makeHeadWeekDays(): { [key: string]: WeekDayLabel } {
    const weekDays: { [key: string]: WeekDayLabel } = {};
    const firstDayOfWeek = this.dateHelper.getFirstDayOfWeek();
    const weekdaysMoment = this.generateWeekdays(firstDayOfWeek, this.dateLocale);
    for (const i in weekdaysMoment) {
      weekDays[i] = {
        short: this.getWeekdayName(weekdaysMoment[i]),
        veryShort: this.getWeekdayName(weekdaysMoment[i])
      };
    }
    return weekDays;
  }
  private makeWeekRows(): WeekRow[] {
    const weekRows: WeekRow[] = [];
    const firstDayOfMonth = this.activeDate.calendarStart({ weekStartsOn: this.dateHelper.getFirstDayOfWeek() });

    for (let week = 0; week < DATE_ROW_NUM; week++) {
      const weekStart = firstDayOfMonth.clone().addDays(week * 7);
      const row: WeekRow = {
        isActive: false,
        isCurrent: false,
        dateCells: [],
        year: weekStart.getYear()
      };

      for (let day = 0; day < 7; day++) {
        const date = weekStart.clone().addDays(day);
        const dateFormat = this.i18n.getLocaleData('DatePicker.lang.dateFormat', 'YYYY-MM-DD');
        const title = date._moment.format(dateFormat);
        const label = date._moment.format('DD');

        const cell: DateCell = {
          value: date,
          label: label,
          isSelected: false,
          isDisabled: false,
          isToday: false,
          title: title,
          dateCellRender: valueFunctionProp(this.dateCellRender, date), // Customized content
          dateFullCellRender: valueFunctionProp(this.dateFullCellRender, date),
          content: `${date.getDate()}`,
          onClick: () => this.changeValueFromInside(date),
          onMouseEnter: () => this.dayHover.emit(date)
        };

        if (this.showWeek && !row.weekNum) {
          row.weekNum = date._moment.week();
        }

        if (date.isToday()) {
          cell.isToday = true;
          row.isCurrent = true;
        }

        if (Array.isArray(this.selectedValue) && date.isSame(this.activeDate, 'month')) {
          // Range selections
          const rangeValue = this.hoverValue && this.hoverValue.length ? this.hoverValue : this.selectedValue;
          const start = rangeValue[0];
          const end = rangeValue[1];
          if (start) {
            if (start.isSame(date, 'day')) {
              cell.isSelectedStartDate = true;
              cell.isSelected = true;
              row.isActive = true;
            }
            if (end) {
              if (end.isSame(date, 'day')) {
                cell.isSelectedEndDate = true;
                cell.isSelected = true;
                row.isActive = true;
              } else if (date.isAfter(start, 'day') && date.isBefore(end, 'day')) {
                cell.isInRange = true;
              }
            }
          }
        } else if (date.isSame(this.value, 'day')) {
          cell.isSelected = true;
          row.isActive = true;
        }

        if (this.disabledDate && this.disabledDate(date)) {
          cell.isDisabled = true;
        }

        cell.classMap = {
          [`${this.prefixCls}-cell`]: true,
          [`${this.prefixCls}-today`]: cell.isToday,
          [`${this.prefixCls}-last-month-cell`]: date.isBefore(this.activeDate, 'month'),
          [`${this.prefixCls}-next-month-btn-day`]: date.isAfter(this.activeDate, 'month'),
          [`${this.prefixCls}-selected-day`]: cell.isSelected,
          [`${this.prefixCls}-disabled-cell`]: cell.isDisabled,
          [`${this.prefixCls}-selected-start-date`]: !!cell.isSelectedStartDate,
          [`${this.prefixCls}-selected-end-date`]: !!cell.isSelectedEndDate,
          [`${this.prefixCls}-in-range-cell`]: !!cell.isInRange
        };

        row.dateCells.push(cell);
      }

      row.classMap = {
        [`${this.prefixCls}-current-week`]: row.isCurrent,
        [`${this.prefixCls}-active-week`]: row.isActive
      };

      weekRows.push(row);
    }

    return weekRows;
  }

  trackByDateFn(_index: number, item: DateCell): string {
    return `${item.title}`;
  }

  trackByWeekFn(_index: number, item: WeekRow): string {
    return `${item.year}-${item.weekNum}`;
  }
}

export interface WeekDayLabel {
  short: string;
  veryShort: string;
}

export interface DateCell {
  value: CandyDate;
  label: string;
  title: string;
  dateCellRender: TemplateRef<CandyDate> | string;
  dateFullCellRender: TemplateRef<CandyDate> | string;
  content: string;
  isSelected?: boolean;
  isToday?: boolean;
  isDisabled?: boolean;
  isSelectedStartDate?: boolean;
  isSelectedEndDate?: boolean;
  isInRange?: boolean;
  classMap?: object;
  onClick(date: CandyDate): void;
  onMouseEnter(): void;
}

export interface WeekRow {
  isCurrent?: boolean; // Is the week that today stays in
  isActive?: boolean; // Is the week that current setting date stays in
  weekNum?: number;
  year?: number;
  classMap?: object;
  dateCells: DateCell[];
}
