import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { OfferJobsPage } from './tab3.page';

describe('OfferJobsPage', () => {
  let component: OfferJobsPage;
  let fixture: ComponentFixture<OfferJobsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferJobsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferJobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
