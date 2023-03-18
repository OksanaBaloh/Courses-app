// import classNames from 'classnames';
import React, { useState } from 'react';
// import ReactPlayer from 'react-player';
import ReactHlsPlayer from 'react-hls-player';
import { CourseWithLessons } from '../../types/courseWithLessons';
import { ErrorType } from '../../types/ErrorType';
import { isInPIP, openPIP, closePIP } from '../../utils';

type Props = {
  course: CourseWithLessons;
  setError: (error: ErrorType) => void;
};

export const CourseItem: React.FC<Props> = ({
  course,
  setError,
}) => {
  const playerRef = React.useRef<HTMLVideoElement>(null);
  const [currentLesson, setCurrentLesson] = useState(course.lessons[0]);
  const [isPIPOn, setIsPIPOn] = React.useState(false);

  course.lessons.forEach(lesson => {
    const progress = JSON.parse(localStorage.getItem(lesson.id) || '0');
    lesson.progress = progress;
  });

  const handleSetProgress = () => {
    if (playerRef.current) {
      const time = Math.floor(playerRef.current.currentTime);
      currentLesson.progress = time;
      localStorage.setItem(currentLesson.id, JSON.stringify(time));
    }
  }

  const togglePIP = async (playerCurrent: HTMLVideoElement | null) => {
    if (!playerCurrent) {
      return;
    }

    if (isInPIP()) {
      try {
        setError(ErrorType.None);
        setIsPIPOn(true);
        await closePIP(playerCurrent);
      } catch (e) {
        setError(ErrorType.PipClose);
      }
    } else {
      try {
        setError(ErrorType.None);
        setIsPIPOn(false);
        await openPIP(playerCurrent);
      } catch (e) {
        setError(ErrorType.PipOpen);
      }
    }
  };

  const { title, lessons } = course;

  return (
    <div className='course'>
      <h2 className="course__title title">{title}</h2>
      <div className="columns">
        <div className="column is-9">
          <div className='player-wrapper'>
            <ReactHlsPlayer
              className='react-player'
              playerRef={playerRef}
              src={`${currentLesson.link}`}
              controls
              muted
              autoPlay={false}
              poster={`${currentLesson.previewImageLink}/lesson-${currentLesson.order}.webp`}
              onPause={handleSetProgress}
              onSeeked={e => {
                if(e.currentTarget.paused) {
                  handleSetProgress();
                };
              }}
              onPlay={e => e.currentTarget.currentTime = currentLesson.progress}
            />
          </div>
          <div className="course__bottom">
            <p className="course__subtitle title">
              {`Lesson ${currentLesson.order} - ${currentLesson.title}`}
            </p>

            <button type="button" onClick={() => togglePIP(playerRef.current)} className="button">
              {isPIPOn ? 'Turn off PIP' : 'Turn on PIP'}
            </button>
          </div>

        </div>

        <div className="column is-3 ">
          <span className="course__subtitle title">Lessons:</span>
          <ul className="course__lessons box content">
            {lessons.map(lesson => (
              <li
                className='course__lesson'
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
              >
                <h4>{`${lesson.order} - ${lesson.title}`}</h4>
                <div className="media">
                  <div className="media-content">
                    <progress className="progress is-info" value={lesson.progress / lesson.duration * 100 || 0} max="100"></progress>
                  </div>

                  <div className="media-right">
                    {lesson.status === 'unlocked'
                      ? (<span className="has-text-grey-light"><i className="fa-solid fa-lock-open"></i> </span>)
                      : (<span className="has-text-grey-light"><i className="fa-solid fa-lock"></i> </span>)
                    }
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

