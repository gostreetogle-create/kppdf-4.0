import { TestBed } from '@angular/core/testing';
import { KpIconComponent } from './kp-icon.component';

describe('KpIconComponent', () => {
  let component: KpIconComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpIconComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(KpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('создаётся без ошибок', () => {
    expect(component).toBeTruthy();
  });

  it('name по умолчанию — пустая строка', () => {
    expect(component.name()).toBe('');
  });

  it('size по умолчанию — 1.25rem', () => {
    expect(component.size()).toBe('1.25rem');
  });

  it('strokeWidth по умолчанию — 2', () => {
    expect(component.strokeWidth()).toBe('2');
  });

  it('class по умолчанию — пустая строка', () => {
    expect(component.class()).toBe('');
  });
});
