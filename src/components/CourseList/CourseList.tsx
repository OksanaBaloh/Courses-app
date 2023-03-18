import React from 'react';
import { Course } from "../../types/course";
import { CourseInfo } from '../CourseInfo';
type Props = {
  courses: Course[];
  selectCourse: (id:string) => void;
};

export const CourseList: React.FC<Props> = ({
  courses,
  selectCourse,
}) => {
  return (
    <ul className="app__list">
      {[...courses].sort((c1, c2) => new Date(c2.launchDate).getTime() - new Date(c1.launchDate).getTime())
        .map(course => (
          <CourseInfo
            key={course.id}
            course={course}
            selectCourse={selectCourse}
          />
        ))
      }
    </ul>
  );
};
