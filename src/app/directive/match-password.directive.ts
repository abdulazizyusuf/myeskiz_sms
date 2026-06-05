import { Directive, Input } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[matchPassword]',
    providers: [{ provide: NG_VALIDATORS, useExisting: MatchPasswordDirective, multi: true }],
    standalone: true
})
export class MatchPasswordDirective implements Validator {
  @Input() matchPassword: string;

  validate(input: AbstractControl): {[key: string]: any} | null {
    if (!input.root) {
      return null;
    }
    const passwordControl = input.root.get('password');
    if (!passwordControl) {
      return null;
    }
    const exactMatch = passwordControl.value == input.value;
    return exactMatch ? null : { mismatchedPassword: true };
  }
}