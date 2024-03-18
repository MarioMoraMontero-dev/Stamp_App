import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stepper-app-first-time',
  templateUrl: './stepper-app-first-time.page.html',
  styleUrls: ['./stepper-app-first-time.page.scss'],
})
export class StepperAppFirstTimePage implements OnInit {

  stepNumber = 1;
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  nextStepper() {
    if (this.stepNumber == 3) {
      this.router.navigateByUrl("/login");
    } else {
      this.stepNumber = this.stepNumber + 1;
    }
  }

}
