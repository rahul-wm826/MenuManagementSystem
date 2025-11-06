import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BuilderComponent } from './builder.component';
import { ProposalService } from '../../services/proposal.service';
import { DishService } from '../../../menu-admin/services/dish.service';
import { CategoryService } from '../../../menu-admin/services/category.service';

describe('BuilderComponent', () => {
  let component: BuilderComponent;
  let fixture: ComponentFixture<BuilderComponent>;
  let proposalService: jasmine.SpyObj<ProposalService>;
  let dishService: jasmine.SpyObj<DishService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let activatedRoute: any;

  const mockDishes = [
    { _id: '1', name: 'Dish 1', category: '1', description: '', images: [] },
    { _id: '2', name: 'Dish 2', category: '1', description: '', images: [] },
    { _id: '3', name: 'Dish 3', category: '2', description: '', images: [] },
  ];

  const mockCategories = [
    { _id: '1', name: 'Category 1' },
    { _id: '2', name: 'Category 2' },
  ];

  const mockProposal = {
    _id: 'prop1',
    name: 'Existing Proposal',
    eventFunctionId: 'func1',
    menuSections: [
      {
        title: 'Appetizers',
        items: [
          { dishId: '1', name: 'Dish 1', description: '', images: [] },
          { dishId: '2', name: 'Dish 2', description: '', images: [] },
        ],
      },
    ],
    clientComments: [],
  };

  beforeEach(async () => {
    proposalService = jasmine.createSpyObj('ProposalService', [
      'getProposalsForFunction',
      'createProposal',
      'updateProposal',
    ]);
    dishService = jasmine.createSpyObj('DishService', ['getDishes']);
    categoryService = jasmine.createSpyObj('CategoryService', ['getCategories']);

    activatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'func1',
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DragDropModule,
        HttpClientTestingModule,
        BuilderComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ProposalService, useValue: proposalService },
        { provide: DishService, useValue: dishService },
        { provide: CategoryService, useValue: categoryService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderComponent);
    component = fixture.componentInstance;

    // Default mocks for services
    dishService.getDishes.and.returnValue(of(mockDishes));
    categoryService.getCategories.and.returnValue(of(mockCategories));
    proposalService.getProposalsForFunction.and.returnValue(of([mockProposal]));
    proposalService.createProposal.and.returnValue(of({ ...mockProposal, name: 'New Proposal', menuSections: [] }));
    proposalService.updateProposal.and.returnValue(of(mockProposal));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should create a new proposal if none exists for the function', () => {
      proposalService.getProposalsForFunction.and.returnValue(of([]));
      const newProposal = { ...mockProposal, name: 'New Proposal', menuSections: [] };
      proposalService.createProposal.and.returnValue(of(newProposal));

      fixture.detectChanges();

      expect(proposalService.createProposal).toHaveBeenCalledWith('func1', { name: 'New Proposal' });
      expect(component.currentProposal).toEqual(newProposal);
    });

    it('should load an existing proposal', () => {
      proposalService.getProposalsForFunction.and.returnValue(of([mockProposal]));

      fixture.detectChanges();

      expect(proposalService.createProposal).not.toHaveBeenCalled();
      expect(component.currentProposal).toEqual(mockProposal);
      expect(component.proposalForm.value.name).toBe(mockProposal.name);
    });
  });

  describe('Component Methods', () => {
    beforeEach(() => {
      fixture.detectChanges(); // ngOnInit
    });

    it('should filter dishes on onCategoryFilterChange', () => {
      const event = { target: { value: '2' } } as any;
      component.onCategoryFilterChange(event);
      expect(component.filteredDishes.length).toBe(1);
      expect(component.filteredDishes[0].category).toBe('2');
    });

    it('should add a new section on onAddSection', () => {
      spyOn(component, 'onSaveProposal');
      component.newSectionForm.setValue({ title: 'Desserts' });
      component.onAddSection();

      expect(component.currentProposal.menuSections.length).toBe(2);
      expect(component.currentProposal.menuSections[1].title).toBe('Desserts');
      expect(component.onSaveProposal).toHaveBeenCalled();
    });

    it('should save the proposal on onSaveProposal', () => {
      component.proposalForm.setValue({ name: 'Updated Proposal Name' });
      component.onSaveProposal();

      expect(proposalService.updateProposal).toHaveBeenCalledWith(
        'prop1',
        jasmine.objectContaining({ name: 'Updated Proposal Name' })
      );
    });
  });

  describe('Drag and Drop', () => {
    beforeEach(() => {
      fixture.detectChanges(); // ngOnInit
      spyOn(component, 'onSaveProposal');
    });

    it('should add a dish from the master list to a section', () => {
      const event = {
        previousContainer: { id: 'master-dish-list', data: mockDishes },
        container: { id: 'section-list-0', data: component.currentProposal.menuSections[0].items },
        previousIndex: 2,
        currentIndex: 1,
        isPointerOverContainer: true,
      } as CdkDragDrop<any[]>;

      component.drop(event);

      expect(component.currentProposal.menuSections[0].items.length).toBe(3);
      expect(component.currentProposal.menuSections[0].items[1].name).toBe('Dish 3');
      expect(component.onSaveProposal).toHaveBeenCalled();
    });

    it('should re-order a dish within the same section', () => {
      const sectionItems = component.currentProposal.menuSections[0].items;
      const event = {
        previousContainer: { id: 'section-list-0', data: sectionItems },
        container: { id: 'section-list-0', data: sectionItems },
        previousIndex: 0,
        currentIndex: 1,
        isPointerOverContainer: true,
      } as CdkDragDrop<any[]>;

      component.drop(event);

      expect(sectionItems[0].name).toBe('Dish 2');
      expect(sectionItems[1].name).toBe('Dish 1');
      expect(component.onSaveProposal).toHaveBeenCalled();
    });
  });
});
