import React, { useEffect, useState } from 'react';
import { CourseList } from './components/CourseList';
import { CourseItem } from './components/CourseItem';
import { Pagination } from './components/Pagination';
import { getCourse, getCourses } from './api/api';
import { Course } from './types/course';
import { CourseWithLessons } from './types/courseWithLessons';
import { Loader } from './components/Loader';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [errorMessage, setErrorMessage] = useState(ErrorType.None);

  const [currentPage, setCurrentPage] = useState(1);
  const total = courses.length;
  const start = (currentPage - 1) * 10;
  const end = Math.min(currentPage * 10, total);
  const visibleCourses = courses.slice(start, end);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  useEffect(() => {
    getCourse(selectedId).then(setCourse);
  }, [selectedId]);

  const handleSetError = (error: ErrorType) => {
    setErrorMessage(error)
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__title-wrapper">
          <h1 className="app__title">My Courses</h1>
        </div>

        {selectedId 
          ? <button
              type="button"
              className="button is-link is-medium"
              onClick={() => setSelectedId('')}
            >
              All Courses
            </button>
          : <Pagination
              total={total}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
        }
      </header>

      <main className="app__content">
        {!courses.length ? (
          <Loader />
        ) : (selectedId 
          ? (course?.lessons ? <CourseItem course={course} setError={handleSetError}/> : <Loader />)
          : <CourseList courses={visibleCourses} selectCourse={(id:string) => setSelectedId(id)}/>
        )}

      {!!errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          onCloseError={() => setErrorMessage(ErrorType.None)}
        />
      )}
      </main>

    </div>
  );
}
