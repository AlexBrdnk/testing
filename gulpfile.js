const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      imagemin = require('gulp-imagemin'),
      sourcemaps = require('gulp-sourcemaps'),
      uglify = require('gulp-uglify'),
      htmlmin = require('gulp-htmlmin'),
      cleanCSS = require('gulp-clean-css');

const app = 'app/',
      dist = 'dist/';

const config = {
    app : {
        html : app + 'index.html',
        style : app + 'scss/**/*.*',
        css :  app + 'css/**/*.*',
        js : app + 'js/**/*.*',
        fonts : app + 'fonts/**/*.*',
        img : app + 'img/**/*.*'
    },
    dist : {
        html : dist,
        style : dist + 'css/',
        js : dist + 'js/',
        fonts : dist + 'fonts/',
        img : dist + 'img/'
    },
    watch : {
        html : app + '*.html',
        style : app + 'scss/**/*.*',
        css :  app + 'css/**/*.*',
        js : app + 'js/**/*.*',
        fonts : app + 'fonts/**/*.*',
        img : app + 'img/**/*.*'
    }
}

const webServer = () => {
    browserSync.init({
        server: {
            baseDir: dist
        },
        host: 'localhost',
        port: 8081,
        notify: false
    })
    
};

const htmlTask = () =>{
    return gulp.src(config.app.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(config.dist.html))
        .pipe(browserSync.reload({stream: true}))
}

const scssTask = () => {
    return gulp.src(config.app.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist.style))
        .pipe(browserSync.reload({stream: true}))
}

const cssTask = () => {
    return gulp.src(config.app.css)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist.style))
        .pipe(browserSync.reload({stream: true}))
}

const jsTask = () => {
    return gulp.src(config.app.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist.js))
        .pipe(browserSync.reload({stream: true}))
}

const imgTask = () => {
    return gulp.src(config.app.img)
        .pipe(gulp.dest(config.dist.img))
        .pipe(imagemin())
        .pipe(browserSync.reload({stream: true}))
}

const fontsTask = () => {
    return gulp.src(config.app.fonts)
        .pipe(gulp.dest(config.dist.fonts))
        .pipe(browserSync.reload({stream: true}))
}

const watchFiles = () =>{
    gulp.watch([config.watch.html], gulp.series(htmlTask));
    gulp.watch([config.watch.style], gulp.series(scssTask));
    gulp.watch([config.watch.css], gulp.series(cssTask));
    gulp.watch([config.watch.fonts], gulp.series(fontsTask));
    gulp.watch([config.watch.img], gulp.series(imgTask));
    gulp.watch([config.watch.js], gulp.series(jsTask));
}

const start = gulp.series(htmlTask, scssTask, fontsTask, imgTask, jsTask, cssTask);

exports.default = gulp.parallel(start, watchFiles, webServer);