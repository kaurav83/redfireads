var gulp = require('gulp');
var less = require('gulp-less');
var notify = require('gulp-notify');
var babel = require('gulp-babel');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var connectPHP = require('gulp-connect-php');
var minifyCss   = require('gulp-minify-css');
var reload      = browserSync.reload;

gulp.task('ES6', () => {
    return gulp.src('js/common.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('js/compile'));
})

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
// NODE_ENV=production gulp styles (РєРѕРјР°РЅРґР° РІ РєРѕРЅСЃРѕР»Рё, РїРѕ РёРґРµРµ СѓРґР°Р»СЏРµС‚ sourceMaps РёР· СЃС‚РёР»РµР№ РІ production)
var paths = {
  html:['*.html'],
    css:['./less/**/*.less']
};

gulp.task('styles', function () {
    return gulp.src('./less/custom.less')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        // .pipe(concat('style.css'))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(less())
        .pipe(autoprefixer ({
			browsers: [
                'last 2 versions',
                'ie 11',
                'android 2.3',
                'Android >= 4',
                'opera 12',
                'Firefox ESR'
            ]
		}))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('./css'))
        .pipe(reload({stream: true}))
        
});

gulp.task('html', function () {
    gulp.src(paths.html)
        .pipe(reload({stream: true}));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./",
      index: "index.html"
    },
    port: 8080,
    open: true,
    notify: false
  });
});

gulp.task('watcher', function () {
    gulp.watch('less/**/*.*', ['styles']);
    gulp.watch(paths.html, ['html']);
    gulp.watch('js/common.js', ['ES6']);
});

gulp.task('default', ['watcher', 'browserSync']);