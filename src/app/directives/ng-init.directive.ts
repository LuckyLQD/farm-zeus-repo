import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[fzNgInit]'
})
export class NgInitDirective {

  constructor() { }

  @Input() cb: Function = function(){};

  @Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // if (this.isLast) {
    //   setTimeout(() => this.initEvent.emit(), 10);
    // }
    this.cb();
  }

}
