import React from 'react';
import ReactHlsPlayer from 'react-hls-player';
import { Course } from "../../types/course";

import { Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

type Props = {
  course: Course;
  selectCourse: (id:string) => void;
};

export const CourseInfo: React.FC<Props> = ({
  course,
  selectCourse,
}) => {
  const playerRef = React.useRef<HTMLVideoElement>(null);

  const playVideo = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  }

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  }

  const { id, title, description, previewImageLink, lessonsCount, rating, meta } = course;

  return (
    <li className="courses box">
      <div className="courses__header columns featured">
        <div className="column is-7 post-img ">
          <img src={`${previewImageLink}/cover.webp`} alt={`Course ${title}`} />
        </div>
        <div className="column is-5 featured-content va">
          <div>
            <h2 className="courses__title title">{title}</h2>
            <span className="courses__subtitle heading">{`Number of lessons: ${lessonsCount}`}</span>
            <div className="courses__rating-box rating">
              <Rating
                value={rating}
                readOnly
                precision={0.1}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <span className="rating__number">{`(${rating})`}</span>
            </div>

            <p className="courses__description">{description}</p>

            <button
              type='button'
              className="courses__button button is-primary"
              onClick={() => selectCourse(id)}
            >
              Learn more
            </button>
          </div>
        </div>
      </div>

      <div className="courses__add columns featured">
        {meta.skills && (
          <ul className="courses__skills column is-5">
            <span className="courses__subtitle heading">Skills</span>
            
          {meta.skills.map(skill => (
            <li className='courses__skill' key={skill}>
              {skill}
            </li>
          ))}
        </ul>
        )}

        {!!meta.courseVideoPreview.duration && (
          <div
            className='player-wrapper column'
            onMouseEnter={playVideo}
            onMouseLeave={pauseVideo}
          >
            <ReactHlsPlayer
              className='react-player'
              src={`${meta.courseVideoPreview.link}`}
              playerRef={playerRef}
              controls
              muted
              loop
              autoPlay={false}
              poster={`${meta.courseVideoPreview.previewImageLink}.webp`}
              // poster={`${previewImageLink}/cover.webp`}
            />
          </div>
        )}
      </div>
    </li>
  );
};
