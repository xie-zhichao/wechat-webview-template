var gulp = require('gulp');
var sftp = require('gulp-sftp');

gulp.task('default', function () {
  return gulp.src('./out/**/*')
    .pipe(sftp({
      host: '192.167.5.113',
      port: 22,
      user: 'root',
      pass: 'ztesa2018!farm',
      remotePath: '/var/cjy/wechatH5/'
    }));
});

gulp.task('nodeServer', function () {
  return gulp.src('./nodeServer.js')
    .pipe(sftp({
      host: '192.167.5.113',
      port: 22,
      user: 'root',
      pass: 'ztesa2018!farm',
      remotePath: '/var/cjy/wechatH5/'
    }));
});

gulp.task('server', function () {
  return gulp.src('./out/**/*')
    .pipe(sftp({
      host: '182.61.11.52',
      port: 22,
      user: 'root',
      pass: 'ztesa2018!',
      remotePath: '/var/ssr/wechat/out'
    }));
});

gulp.task('proNodeServer', function () {
  return gulp.src('./nodeServer.js')
    .pipe(sftp({
      host: '182.61.11.52',
      port: 22,
      user: 'root',
      pass: 'ztesa2018!',
      remotePath: '/var/ssr/wechat'
    }));
});