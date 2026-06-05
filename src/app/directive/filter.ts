import { Pipe, PipeTransform, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any, filter: any): any {
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      return items.filter(item =>
        filterKeys.reduce((memo, keyName) =>
          (memo && (filter[keyName] === item[keyName])) || filter[keyName] === "", true));
    } else
        return items;
  }

}

@Pipe({
    name: 'searching',
    standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(items: any, term: string): any {
    if (!term || !items) return items;

    return SearchPipe.filter(items, term);
  }

  static filter(items: Array<{ [key: string]: any }>, term: string): Array<{ [key: string]: any }> {

    const toCompare = term.toLowerCase();

    return items.filter(function (item: any) {
      for (let property in item) {
        if (item[property] === null) {
          continue;
        }
        if (item[property].toString().toLowerCase().includes(toCompare)) {
          return true;
        }
      }
      return false;
    });
  }
}

@Pipe({
    name: 'isEmpty',
    standalone: true
})
export class IsEmptyPipe implements PipeTransform {

  transform(items: any): any {
    if(items.length > 0) {
      let data: any[] = [];
      items.filter(item => {
        if(item.count > 0){
          if(item.data[0].length != 0)
            data.push(item);
        }
      });
      return data;
    }
  }

}

@Pipe({
    name: 'servicetype',
    standalone: true
})
export class ServicetypePipe implements PipeTransform {

  transform(type: string): any {
    if(type) {
      let title;
      if(type == 'domain')
        title = 'Домен';        
      else if (type == 'hosting') 
        title = 'Хостинг';      
      else if (type == 'website')
        title = 'Веб сайт';
      else if (type == 'ssl')  
        title = 'SSL сертификат';

      return title;
    }
  }

}

@Pipe({
    name: 'period',
    standalone: true
})
export class PeriodPipe implements PipeTransform {

  transform(item: number, type:string): any {
    if(type) {
      let title;
      var lang = localStorage.getItem('curLang');
      
      if(type == 'year' || type == 'yearly'){
        if(item == 1){
          if(lang == 'ru')
            title = 'год';
          if(lang == 'en')
            title = 'year';
        }
        else if (item > 1 && item < 5){
          if(lang == 'ru')
            title = 'года';
          if(lang == 'en')
            title = 'years';
        }
        else if (item >= 5){
          if(lang == 'ru')
            title = 'лет';
          if(lang == 'en')
            title = 'years';
        }
          
        if(lang == 'oz')
          title = 'йилга';
        if(lang == 'uz')
          title = 'yilga'; 

      } 
      
      if (type == 'month' || type == 'monthly') {    
        if(lang == 'ru')
          title = 'месяц';
        if(lang == 'en')
          title = 'month';
        if(lang == 'oz')
          title = 'ойга';
        if(lang == 'uz')
          title = 'oyga';   
      }

      var data = item + ' ' + title;

      if(lang == 'ru')
        data = 'на ' + data;
         
      if(lang == 'en')
        data = 'for ' + data;

      if (type == 'one_time') {    
        if(lang == 'ru')
          data = 'разовая';
        if(lang == 'en')
          data = 'one-time';
        if(lang == 'oz')
          data = 'бир марталик';
        if(lang == 'uz')
          data = 'bir martalik';   
      }
    
      return data;
    }
  }

}

@Pipe({
    name: 'total',
    standalone: true
})
export class TotalPipe implements PipeTransform {

    transform(data: any, key:string): any {
      if(data){
        var total = 0;
        for(var i = 0; i < data.length; i++){
          total += Number(data[i][key]);
        }
        return total;
      }
    }

}

@Pipe({
    name: 'endDate',
    standalone: true
})
export class EndDatePipe implements PipeTransform {

    transform(date: any, period:number): any {
      if(date){
        date = new Date(date);
        date = new Date(date.getFullYear() + period, date.getMonth(), date.getDate());
        return date;
      }
    }

}

@Pipe({
    name: 'time',
    standalone: true
})
export class TimePipe implements PipeTransform {
  transform(date: any, format: string): any {
    if (!date) return null;

    const datePipe = new DatePipe("en-US");
    return datePipe.transform(new Date(date), format);
  }
}

@Pipe({
    name: 'timeZone',
    standalone: true
})
export class TimeZonePipe implements PipeTransform {
  transform(date: any, format:string): any {
    var datePipe = new DatePipe("en-US");  
    var dateFormat = date.replace(' ', 'T');
    dateFormat = new Date(dateFormat);
    dateFormat.setHours(dateFormat.getHours() + 5);
    dateFormat = (new Date(dateFormat).getTime()) - (new Date(dateFormat).getTimezoneOffset());
    return datePipe.transform(dateFormat, format);
  }
}

@Pipe({
    name: 'smsCount',
    standalone: true
})
export class SmsCountPipe implements PipeTransform {

  transform(content: any): any {
    if(content && content.length > 0) {
      var regexp = new RegExp("^[A-Za-z0-9 \\r\\n@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘ\u0394_\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039EÆæßÉ!\"#$%&'()*+,\\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\\\\\[~\\]|\u20AC]*$");
      var isGsm = regexp.test(content);
      var smsCount;   
      
      if(!isGsm){
        if(content.length <= 70)
          smsCount = 1;
        else if(content.length <= 134)
          smsCount = 2;  
        else if(content.length <= 201)
          smsCount = 3;
        else if(content.length <= 268)
          smsCount = 4;
        else if(content.length <= 335)
          smsCount = 5;
        else if(content.length <= 402)
          smsCount = 6;      
        else if(content.length <= 469)
          smsCount = 7;
        else if(content.length <= 536)
          smsCount = 8;
      }

      if(isGsm){
        if(content.length <= 160)
          smsCount = 1;
        else if(content.length <= 306)
          smsCount = 2;  
        else if(content.length <= 459)
          smsCount = 3;
        else if(content.length <= 612)
          smsCount = 4;
        else if(content.length <= 765)
          smsCount = 5;
        else if(content.length <= 918)
          smsCount = 6;      
        else if(content.length <= 1071)
          smsCount = 7;
        else if(content.length <= 1224)
          smsCount = 8;
      }

      if(content == '')
        smsCount = 0;

      return smsCount;
    }
  }

}

@Pipe({
    name: 'replaceLineBreaks',
    standalone: true
})
export class ReplaceLineBreaks implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br/>');
  }
}

@Pipe({
    name: 'originalPrice',
    standalone: true
})
export class OriginalPricePipe implements PipeTransform {

  transform(price: number, percantage:number): any {
    if(price && percantage){
      var result = price + ((price / (100 - percantage) * percantage));
      return result;
    }
  }

}

@Pipe({
    name: 'logTime',
    standalone: true
})
export class LogTimePipe implements PipeTransform {
  transform(date: any): any {
    if(date){
      var now = new Date().getTime();
      var d = new Date(Date.parse(date));
      d.setHours((new Date(date).getHours() - 5) + 2);
      if(now <= new Date(d).getTime())
        return true;
      else
        return false;
    } else
      return false;
  }
}

@Pipe({
    name: 'safe',
    standalone: true
})
export class SafePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Pipe({
    name: 'orderBy',
    standalone: true
})
export class OrderBy implements PipeTransform {
  transform(obj: any, orderFields: string): any {
      
    var orderType = 'ASC';

    if (orderFields[0] === '-') {
      orderFields = orderFields.substring(1);
      orderType = 'DESC';
    }

    obj.sort(function(a, b) {
      if (orderType === 'ASC') {
        if (a[orderFields] < b[orderFields]) return -1;
        if (a[orderFields] > b[orderFields]) return 1;
        return 0;
      } else {
        if (a[orderFields] < b[orderFields]) return 1;
        if (a[orderFields] > b[orderFields]) return -1;
        return 0;
      }
    });
    return obj;
  }
}