import React, { useCallback, useEffect, useReducer, useState } from 'react';
import debounce from 'lodash/debounce';
import cn from 'classnames';
import device from 'current-device';
import { Howl } from 'howler';
import portraitLeafsData from './portrait-leafs-data';
import landscapeLeafsData from './landscape-leafs-data';
import leaf1Path from './res/leaf-1.svg';
import leaf2Path from './res/leaf-2.svg';
import leaf3Path from './res/leaf-3.svg';
import leaf4Path from './res/leaf-4.svg';
import leaf5Path from './res/leaf-5.svg';
import leaf6Path from './res/leaf-6.svg';
import leaf7Path from './res/leaf-7.svg';
import leaf8Path from './res/leaf-8.svg';
import leaf9Path from './res/leaf-9.svg';
import handPath from './res/hand.svg';
import leafsRustlingPath from './res/leafs-rustling.mp3';
import classes from './styles.module.scss';

const MAX_PASSED_LENGTH = 1000;

const leafsPathes = [
  leaf1Path, leaf2Path, leaf3Path, leaf4Path, leaf5Path,
  leaf6Path, leaf7Path, leaf8Path, leaf9Path,
];
const leafsRustlingSound = new Howl({
  src: [leafsRustlingPath],
});

const Leafs = ({onMaxPassedLengthReached, initialPassedLength}) => {
  const [{passedLength}, addPassedLength] =
    useReducer(
      (state, clientX) => {
        if (state.lastClientX !== null) {
          const newPassedLength = Math.min(
            state.passedLength + Math.abs(clientX - state.lastClientX),
            MAX_PASSED_LENGTH
          );
          if (state.passedLength !== MAX_PASSED_LENGTH
              && newPassedLength === MAX_PASSED_LENGTH
          ) {
            onMaxPassedLengthReached();
          }
          return {
            passedLength: newPassedLength,
            lastClientX: clientX
          };
        }
        return {passedLength: state.passedLength, lastClientX: clientX};
      },
      {passedLength: initialPassedLength, lastClientX: null},
    );
  const [shakeInProgress, setShakeInProgress] = useState(false);
  const setShakeInProgressDebounced = useCallback(
    debounce(setShakeInProgress, 300),
    [],
  );
  const onTouchMove = useCallback(
    (event) => {
      addPassedLength(event.touches[0].clientX);
      setShakeInProgress(true);
      setShakeInProgressDebounced(false);
    },
    [],
  );

  const onMouseMove = useCallback((event) => {
    if ((event.buttons & 1) === 0) return;
    addPassedLength(event.clientX);
    setShakeInProgress(true);
    setShakeInProgressDebounced(false);
  }, []);

  useEffect(() => {
    if (shakeInProgress) {
      leafsRustlingSound.play();
    } else {
      leafsRustlingSound.stop();
    }
  }, [shakeInProgress]);

  const [leafs, setLeafs] = useState(device.portrait() ? portraitLeafsData : landscapeLeafsData);

  useEffect(() => {
    const onOrientationChange = () => {
      setLeafs(device.portrait() ? portraitLeafsData : landscapeLeafsData);
    }
    device.onChangeOrientation(onOrientationChange);
  }, []);

  return <div onTouchMove={['tablet', 'mobile'].includes(device.type) ? onTouchMove : undefined}
    onMouseMove={'desktop' === device.type ? onMouseMove : undefined}
    className={cn(
      classes['leafs'],
      {[classes['leafs_disable-reaction']]: passedLength === MAX_PASSED_LENGTH},
  )}>
    {leafs.map((leaf, index) => {
      const style = {
        left: leaf.x, top: leaf.y,
      };
      let className;
      if (passedLength === MAX_PASSED_LENGTH) {
        className = classes['leafs__leaf_expansion'];
        style['--expansion-target-x'] = leaf.expansionTargetX;
        style['--expansion-target-y'] = leaf.expansionTargetY;
      } else if (shakeInProgress) {
        className = classes['leafs__leaf_shake'];
        style['--shake-target-x'] = leaf.shakeTargetX;
        style['--shake-target-y'] = leaf.shakeTargetY;
        style['--shake-rotate-amplitude'] = leaf.shakeRotateAmplitude;
      }
      return <img className={cn(classes['leafs__leaf'], className)}
        src={leafsPathes[leaf.imgIndex]}
        style={style}
        key={index}
      />;
    })}
    {passedLength !== MAX_PASSED_LENGTH && <div className={classes['leafs__rustle-hint']}>
      <div className={classes['leafs__pictogram']}>
        <div className={classes['leafs__line']}></div>
        <img className={classes['leafs__hand']} src={handPath} />
      </div>
      <span className={classes['leafs__text']}>
        Пошуршите листьями, заберите промокод
      </span>
    </div>}
  </div>;
};

export default Leafs;