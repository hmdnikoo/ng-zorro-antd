import { Component } from '@angular/core';
import { en_US, fa_IR, NzI18nService } from 'ng-zorro-antd';

@Component({
  selector: 'nz-demo-calendar-basic',
  template: `
    <button nz-button nzType="default" (click)="changeLanguage()">Switch language</button>
    <nz-calendar
      [nzDateLocale]="dateLocale"
      [(ngModel)]="date"
      [(nzMode)]="mode"
      (nzPanelChange)="panelChange($event)"
    ></nz-calendar>
  `
})
export class NzDemoCalendarBasicComponent {
  date = new Date(2012, 11, 21);
  mode = 'month';
  isEnglish = false;
  dateLocale = 'en';

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }

  constructor(private i18n: NzI18nService) {}
  changeLanguage(): void {
    this.i18n.setLocale(this.isEnglish ? fa_IR : en_US);
    this.dateLocale = this.isEnglish ? 'fa' : 'en';
    this.isEnglish = !this.isEnglish;
  }
}
