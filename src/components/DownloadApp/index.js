import React from 'react';
import logoPath from './res/logo.svg';
import qrPath from './res/qr.svg';
import classes from './styles.module.scss';

const DownloadApp = () => {
  return <a className={classes['download-app']}
    href="https://go.onelink.me/RJVj/4afb7386?af_qr=true"
    target="_blank"
  >
    <img className={classes['download-app__qr']} src={qrPath} />
    <img className={classes['download-app__logo']} src={logoPath} />
    <div className={classes['download-app__text']}>
      Скачать<br />приложение
    </div>
  </a>;
};

export default DownloadApp;