/*
 * gulp
 * devDependencies included in package.json
 * npm install to get started
 */

// Load plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var http = require('http');
var st = require('st');

// Styles
gulp.task('styles', function() {
    return gulp.src([
        'Sass/global.scss'
    ])
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            notify.onError({
                message: 'Error in styles task: <%= error.message %>',
                sound: false
            })(err);
            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano({ zindex: false, reduceIdents: false }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'))
    .pipe(notify({ message: 'Styles task completed', onLast: true }));
});
 
// Scripts
gulp.task('scripts', function() {
    return gulp.src([
        'scripts/script.js'
    ])
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            notify.onError({
                message: 'Error in scripts task: <%= error.message %>'
            })(err);
            this.emit('end');
        }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('scripts'))
    .pipe(notify({ message: 'Scripts task completed' }));
});
 
// Watch - watcher for changes in scss and js files: 'gulp watch' will run these tasks
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('sass/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('scripts/global.js', ['scripts']);
});

gulp.task('server', function(done) {
    http.createServer(
        st({ path: __dirname, index: 'index.html', cache: false })
    ).listen(8080, done);
});

gulp.task('default', ['scripts', 'styles', 'server', 'watch']);

