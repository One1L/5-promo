import React, { useEffect, useState } from 'react';
import device from 'current-device';
import axios from 'axios';
import { keepHtmlFontSize } from './utils';
import Leafs from './components/Leafs';
import PromoCode from './components/PromoCode';
import DownloadApp from './components/DownloadApp';
import logoPath from './res/logo.svg';
import classes from  './App.module.scss';

let stopKeepHtmlFontSize;
const onOrientationChange = () => {
  if (stopKeepHtmlFontSize) stopKeepHtmlFontSize();
  if (device.portrait()) {
    keepHtmlFontSize(320, 568);
  } else {
    keepHtmlFontSize(1920, 965);
  }
};
onOrientationChange();
device.onChangeOrientation(onOrientationChange);

const App = () => {
  const [maxPassedLengthReached, setMaxPassedLengthReached] = useState(false);
  const [promocode, setPromocode] = useState(null);
  const [initialPassedLength, setInitialPassedLength] = useState(0);
  useEffect(() => {
    (async () => {
      const savedPromocode = localStorage.getItem('promocode');
      if (!!savedPromocode) {
        setPromocode(savedPromocode);
        setInitialPassedLength(1000);
        setMaxPassedLengthReached(true);
        return;
      }
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const {data: response} = await axios.get(
        `/api/get-promocode/${urlParams.get('utm_campaign')}/${urlParams.get('utm_source')}`
      );
      localStorage.setItem('promocode', response.value);
      setPromocode(response.value);
    })();
  }, []);
  if (promocode === null) return <></>;
  return <div className={classes.app}>
    <Leafs onMaxPassedLengthReached={() => setMaxPassedLengthReached(true)}
      initialPassedLength={initialPassedLength}
    />
    <div className={classes.app__top}>
      <img src={logoPath} className={classes.app__logo} />
      <div className={classes['app__discount-and-description']}>
        <span className={classes.app__discount}>25%</span>
        <span className={classes.app__description}>
          На первый заказ от 1 000 рублей в приложении «Пятёрочка Доставка»
        </span>
      </div>
    </div>
    <div className={classes.app__bottom}>
      {maxPassedLengthReached && <>
        <PromoCode promocode={promocode} />
        <DownloadApp />
      </>}
      <div className={classes.app__footer}>
        <div className={classes['app__footer-inner']}>Продавец ООО «Агроторг», ОГРН 1027809237796, г. Санкт-Петербург, Невский проспект, д. 90/92. Указанное время доставки не включает в себя время на приём, обработку и сбор заказа. Зона и время доставки ограничены. Подробные условия в мобильном приложении «Пятёрочка Доставка» или «Пятёрочка». Реклама.</div>
      </div>
    </div>
  </div>;
};
export default App;