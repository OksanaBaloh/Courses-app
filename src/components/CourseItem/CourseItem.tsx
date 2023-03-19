import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import { CourseWithLessons } from '../../types/courseWithLessons';
import { ErrorType } from '../../types/ErrorType';
import { isInPIP, openPIP, closePIP } from '../../utils';

type Props = {
  course: CourseWithLessons;
  setError: (error: ErrorType) => void;
};

export const CourseItem: React.FC<Props> = ({ course, setError }) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [currentLesson, setCurrentLesson] = useState(course.lessons[0]);

  course.lessons.forEach((lesson) => {
    const progress = JSON.parse(localStorage.getItem(lesson.id) || '0');
    lesson.progress = progress;
  });

  const handleSetProgress = () => {
    if (playerRef.current) {
      const time = Math.floor(playerRef.current.currentTime);
      currentLesson.progress = time;
      localStorage.setItem(currentLesson.id, JSON.stringify(time));
    }
  };

  const turnOnPip = async (playerCurrent: HTMLVideoElement | null) => {
    if (!playerCurrent) {
      return;
    }

    if (!isInPIP()) {
      try {
        setError(ErrorType.None);
        await openPIP(playerCurrent);
      } catch (e) {
        setError(ErrorType.PipOpen);
      }
    }
  };

  const turnOffPip = async (playerCurrent: HTMLVideoElement | null) => {
    if (!playerCurrent) {
      return;
    }

    if (isInPIP()) {
      try {
        setError(ErrorType.None);
        await closePIP(playerCurrent);
      } catch (e) {
        setError(ErrorType.PipClose);
      }
    }
  };

  const { title, lessons } = course;

  return (
    <div className="course">
      <h2 className="course__title title">{title}</h2>
      <div className="columns">
        <div className="column is-9">
          <div className="player-wrapper">
            <ReactHlsPlayer
              className="react-player"
              playerRef={playerRef}
              src={`${currentLesson.link}`}
              controls
              muted
              autoPlay={false}
              poster={`${currentLesson.previewImageLink}/lesson-${currentLesson.order}.webp`}
              onPause={handleSetProgress}
              onSeeked={(e) => {
                if (e.currentTarget.paused) {
                  handleSetProgress();
                }
              }}
              onPlay={(e) => (e.currentTarget.currentTime = currentLesson.progress)}
            />
          </div>
          <div className="course__button-container">
            <button type="button" onClick={() => turnOnPip(playerRef.current)} className="button">
              Turn on PIP
            </button>
            <button type="button" onClick={() => turnOffPip(playerRef.current)} className="button">
              Turn off PIP
            </button>
          </div>
          <p className="course__lesson-title title">
            {`Lesson ${currentLesson.order} - ${currentLesson.title}`}
          </p>
        </div>

        <div className="column is-3 ">
          <span className="course__subtitle title">Lessons:</span>
          <ul className="course__lessons box content">
            {lessons.map((lesson) => (
              <li
                className={classNames('course__lesson', {
                  'course__lesson--active': lesson.id === currentLesson.id
                })}
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
              >
                <h4 className="course__lesson-li-title">{`${lesson.order} - ${lesson.title}`}</h4>
                <div className="media">
                  <div className="media-content">
                    <progress
                      className="progress is-info"
                      value={(lesson.progress / lesson.duration) * 100 || 0}
                      max="100"
                    ></progress>
                  </div>

                  <div className="media-right">
                    <span className="has-text-grey-light">
                      <i
                        className={classNames(
                          'fa-solid',
                          { 'fa-lock-open': lesson.status === 'unlocked' },
                          { 'fa-lock': lesson.status === 'locked' }
                        )}
                      ></i>
                    </span>
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
