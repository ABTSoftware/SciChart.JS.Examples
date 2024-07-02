import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EXAMPLES_PAGES } from '../../services/angularExample';

@Component({
  selector: 'app-angular-examples',
  templateUrl: './angular-examples.component.html',
  styleUrls: ['./angular-examples.component.css']
})
export class AngularExamplesComponent implements OnInit {

  constructor() {
    let exampleArr = EXAMPLES_PAGES;
    Object.values(exampleArr).forEach((page) => {
      let obj = {
        href : '/angularDemo/'+page.path,
        text : page.title
      }
      this.chartLinks.push(obj);
  });
  }
  chartLinks:any = [];
  ngOnInit(): void {
    
  }

}
