import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  input,
  signal,
} from '@angular/core';
import { IBook } from '@path-interfaces/IBook';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { BasePageComponent } from '@path-components/base-page/base-page.component';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '@path-pipes/filter.pipe';
import { ImgcursoPipe } from '@path-pipes/imgcurso.pipe';
import { MessageDateConclusionPipe } from '@path-pipes/message-date-conclusion.pipe';
import { PrintTagsPipe } from '@path-pipes/print-tags.pipe';
import { SortbyPipe } from '@path-pipes/sortby.pipe';
import { GoogleAnalyticsDirective } from '@path-app/directives/google-analytics.directive';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-book',
  imports: [
    CommonModule,
    FilterPipe,
    ImgcursoPipe,
    MessageDateConclusionPipe,
    PrintTagsPipe,
    NgxPaginationModule,
    GoogleAnalyticsDirective,
    SortbyPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BookComponent extends BasePageComponent implements OnInit {
  books = input.required<IBook[]>({ alias: 'books' });

  publishNameList: WritableSignal<Set<string>> = signal<Set<string>>(
    new Set<string>()
  );
  tags: WritableSignal<Set<string>> = signal<Set<string>>(new Set<string>());

  publishNameFilter: WritableSignal<Set<string>> = signal<Set<string>>(
    new Set<string>()
  );
  selectInstitutionsFilter: WritableSignal<string> = signal<string>('');

  tagsFilter: WritableSignal<Set<string>> = signal<Set<string>>(
    new Set<string>()
  );
  selectTagFilter: WritableSignal<string> = signal<string>('');

  config: WritableSignal<PaginationInstance> = signal<PaginationInstance>({
    id: 'booksPag',
    itemsPerPage: 5,
    currentPage: 1,
  });

  ngOnInit(): void {
    this.books().forEach((book) =>
      this.publishNameList().add(book.publishName.trim())
    );
    this.books().forEach((book) =>
      book.tags.forEach((tag) => this.tags().add(tag.trim()))
    );
  }

  getPublishNameList = () =>
    Array.from(this.publishNameList().values()).sort((a, b) =>
      a > b ? 1 : -1
    );

  getTags = () =>
    Array.from(this.tags().values()).sort((a, b) => (a > b ? 1 : -1));

  absoluteIndex(indexOnPage: number): number {
    return (
      this.config().itemsPerPage * (this.config().currentPage - 1) +
      indexOnPage +
      1
    );
  }

  onPageChange(number: number) {
    this.config().currentPage = number;
  }

  clearFilters() {
    this.publishNameFilter().forEach((x) => {
      document.getElementById(`label_book_institution_${x}`)?.click();
    });

    this.tagsFilter().forEach((x) => {
      document.getElementById(`label_book_tag_${x}`)?.click();
    });

    this.publishNameFilter().clear();
    this.selectInstitutionsFilter.set('');
    this.tagsFilter().clear();
    this.selectTagFilter.set('');
  }

  onClickIntitutionEvent(e: MouseEvent) {
    let link = e.target as HTMLInputElement;
    let id = link.id.replace('input_book_institution_', '');

    this.publishNameFilter().has(id)
      ? this.publishNameFilter().delete(id)
      : this.publishNameFilter().add(id);
    this.selectInstitutionsFilter.set(
      Array.from(this.publishNameFilter().values()).join(',')
    );

    this.config().currentPage = 1;
  }

  onClickTagEvent(e: MouseEvent) {
    let link = e.target as HTMLInputElement;
    let id = link.id.replace('input_book_tag_', '');

    this.tagsFilter().has(id)
      ? this.tagsFilter().delete(id)
      : this.tagsFilter().add(id);
    this.selectTagFilter.set(Array.from(this.tagsFilter().values()).join(','));
  }
}
