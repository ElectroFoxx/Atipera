import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { PeriodicElement } from '../model/element.model';
import { computed } from '@angular/core';

type ElementStoreState = {
  elements: PeriodicElement[];
  isLoading: boolean;
  query: string;
};

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

const initialState: ElementStoreState = {
  elements: [],
  isLoading: false,
  query: '',
};

export const ElementStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    filteredElements: computed(() => {
      const query = state.query().toLowerCase().trim();
      if (!query) return state.elements();

      return state.elements().filter((element) => {
        return Object.values(element).some((value) =>
          value.toString().toLowerCase().includes(query)
        );
      });
    }),
  })),
  withMethods((store) => ({
    async loadAll(): Promise<void> {
      patchState(store, { isLoading: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        patchState(store, { elements: ELEMENT_DATA });
      } catch (error) {
        console.error('Failed to load elements', error);
      } finally {
        patchState(store, { isLoading: false });
      }
    },
    setQuery(query: string): void {
      patchState(store, { query });
    },
    updateElement(element: PeriodicElement): void {
        const elements = store.elements().map((el) =>
            el.position === element.position ? element : el
        );
        patchState(store, { elements });
        }
  }))
);
