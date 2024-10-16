import { Component, ChangeDetectionStrategy, OnInit, input, signal, WritableSignal } from '@angular/core'
import { ICourse } from '@path-interfaces/ICourse'
import { PaginationInstance } from 'ngx-pagination'
import { BasePageComponent } from '@path-components/base-page/base-page.component'

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent extends BasePageComponent implements OnInit {
  courses = input.required<ICourse[]>({ alias: 'courses' })

  courseList: WritableSignal<Set<string>> = signal<Set<string>>(new Set<string>())
  tags: WritableSignal<Set<string>> = signal<Set<string>>(new Set<string>())

  coursesFilter: WritableSignal<Set<string>> = signal<Set<string>>(new Set<string>())
  selectInstitutionsFilter: WritableSignal<string> = signal<string>('')

  tagsFilter: WritableSignal<Set<string>> = signal<Set<string>>(new Set<string>())
  selectTagFilter: WritableSignal<string> = signal<string>('')

  config: WritableSignal<PaginationInstance> = signal<PaginationInstance>({
    id: 'coursesPag',
    itemsPerPage: 5,
    currentPage: 1,
  })

  ngOnInit(): void {
    this.courses().forEach((course) => this.courseList().add(course.institution.trim()))
    this.courses().forEach((course) => course.tags.forEach((tag) => this.tags().add(tag.trim())))
  }

  getCourseList = () => Array.from(this.courseList().values()).sort((a, b) => (a > b ? 1 : -1))

  getTags = () => Array.from(this.tags().values()).sort((a, b) => (a > b ? 1 : -1))

  absoluteIndex = (indexOnPage: number): number => this.config().itemsPerPage * (this.config().currentPage - 1) + indexOnPage + 1

  onPageChange = (number: number) => (this.config().currentPage = number)

  clearFilters() {
    this.coursesFilter().forEach((x) => {
      document.getElementById(`label_course_institution_${x}`)?.click()
    })

    this.tagsFilter().forEach((x) => {
      document.getElementById(`label_course_tag_${x}`)?.click()
    })

    this.coursesFilter().clear()
    this.selectInstitutionsFilter.set('')
    this.tagsFilter().clear()
    this.selectTagFilter.set('')
  }

  onClickIntitutionEvent(e: MouseEvent) {
    let link = e.target as HTMLInputElement
    let id = link.id.replace('input_course_institution_', '')

    this.coursesFilter().has(id) ? this.coursesFilter().delete(id) : this.coursesFilter().add(id)
    this.selectInstitutionsFilter.set(Array.from(this.coursesFilter().values()).join(','))

    this.config().currentPage = 1
  }

  onClickTagEvent(e: MouseEvent) {
    let link = e.target as HTMLInputElement
    let id = link.id.replace('input_course_tag_', '')

    this.tagsFilter().has(id) ? this.tagsFilter().delete(id) : this.tagsFilter().add(id)
    this.selectTagFilter.set(Array.from(this.tagsFilter().values()).join(','))
  }
}
