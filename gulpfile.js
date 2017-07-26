const path = require('path');
const nunjucks = require('nunjucks');
const gulp = require('gulp');
const fs = require('fs-jetpack');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const del = require('del');
const merge = require('merge-stream');

var cache;
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(['views','views/showpages'],{
    watch:false,//MARK:如果为true，则会导致html任务挂在那儿
    noCache:true
  }),
  {
    autoescape:false
  }
);

function render(template, context) {
  return new Promise(function(resolve, reject) {
      env.render(template,context,function(err,res) {
        if(err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
}

// TODO: Simplify this task By Promise.All()

gulp.task('html1',function() {
  const destDir = '.tmp';
  const dataFileArr = fs.find('data',{
    matching:'*.json',
    files:true,
    directories:false,
    recursive:false
  });//得到data目录下所有json文件路径(包含'data'这一层)
  function renderOneView(item) {
    return new Promise(
      async function(resolve, reject) {
        const dataForRender = await fs.readAsync(item, 'json');
        const baseName = path.basename(item,'.json');
        let renderFile = '';
        if(baseName === 'index') {
          renderFile = `${baseName}.html`;
        } else {
          renderFile = `show-${baseName}.html`;
        }
        const result = {
          dataForRender,
          renderFile
        }
        resolve(result);
        //reject(error);
      }
    )
    .then(async result => {
      const renderResult = await render(result.renderFile, result.dataForRender);
      return {
        renderResult,
        renderFile: result.renderFile
      }; 
    })
    .then(result => {
      const destFile = path.resolve(destDir, result.renderFile);
      fs.writeAsync(destFile, result.renderResult);
    })
    .catch(error => {
      console.log(error);
    });
  }
  function renderViews(dataFileArr) {
    return dataFileArr.map((item) => { //返回一个Promise数组
     return renderOneView(item);
    });
  }
   
  return Promise.all(renderViews(dataFileArr))
    .then(() => {
      browserSync.reload('*.html');
    })
    .catch(error => {
      console.log(error);
    });
});

gulp.task('html',async function() {
  const destDir = '.tmp';
  const dataFileArr = fs.find('data',{
    matching:'*.json',
    files:true,
    directories:false,
    recursive:false
  });//得到data目录下所有json文件路径(包含'data'这一层)
  function renderOneView(item) {
    return new Promise (
      async function(resolve, reject) {
        const dataForRender = await fs.readAsync(item, 'json');
        const baseName = path.basename(item,'.json');
        let renderFile = '';
        if(baseName === 'index') {
          renderFile = `${baseName}.html`;
        } else {
          renderFile = `show-${baseName}.html`;
        }
        const renderResult = await render(renderFile, dataForRender);
        const destFile = path.resolve(destDir, renderFile);
        const result = {
          renderResult,
          destFile
        };
        resolve(result);
      }
    )
    .then(result => {
      fs.writeAsync(result.destFile, result.renderResult);
    })
    .catch(error => {

    })
  }
  function renderViews(dataFileArr) {
    return dataFileArr.map((item) => { //返回一个Promise数组
     return renderOneView(item);
    });
  }
  return Promise.all(renderViews(dataFileArr))
    .then(() => {
      browserSync.reload('*.html');
    })
    .catch(error => {
      console.log(error);
    });
});


/*
gulp.task('script',() => {
  // TODO:关于rollup需要再认真学习一下
   return rollup({
     entry:'client/js/main.js',
     cache: cache,
     plugins:[
       babel({//这里需要配置文件.babelrc
         exclude:'node_modules/**'
       }),
       nodeResolve({
         jsnext:true,
       })
     ]
   }).then(function(bundle) {
     cache = bundle;//Cache for later use
     return bundle.write({//返回promise，以便下一步then()
       dest: '.tmp/scripts/main.js',
       format: 'iife',
       sourceMap: true,
     });
   }).then(() => {
     browserSync.reload();
   }).catch(err => {
     console.log(err);
   });
});
*/
gulp.task('script', () => {
  const destDir = '.tmp/scripts';
  return gulp.src('client/js/*.js')
  .pipe(gulp.dest(destDir));
})

gulp.task('style',() => {
  const destDir = '.tmp/styles';
  return gulp.src('client/styles/main.scss')
    .pipe($.changed(destDir))
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      includePaths:['bower_components'],//@import的东西的查找位置
      outputStyle:'expanded',
      precision:10
    }).on('error',$.sass.logError))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(destDir))
    .pipe(browserSync.stream({once:true}));
});

gulp.task('copysource', () => {
  const complexpagesDir = '.tmp/complex_pages';
  const templatesDir = '.tmp/templates';

  const complexpagesStream = gulp.src('complex_pages/**.html')
    .pipe(gulp.dest(complexpagesDir));
  const templatesStream = gulp.src('views/templates/**.html')
    .pipe(gulp.dest(templatesDir));
  return merge(complexpagesStream,templatesStream);
});
gulp.task('serve',gulp.parallel('html','style','script','copysource',function() {
  browserSync.init({
    server:{
      baseDir: ['.tmp'],
      //directory:true,
      routes: {
        '/bower_components':'bower_components',
        '/node_modules':'node_modules'
      }
    },
    port:8080//一定要和“创建凭据”的“已获授权的 JavaScript 来源”设置的端口一致
  });
  gulp.watch('client/styles/**/*.scss',gulp.parallel('style'));
  gulp.watch('client/js/**/*.js',gulp.parallel('script'));
  gulp.watch(['views/*.html','views/**/*.html','data/*.json'],gulp.parallel('html'));
  gulp.watch(['views/templates/*.html','complex_pages/*.html'],gulp.parallel('copysource'));
}));

gulp.task('del', (done) => {
 del(['.tmp','dist','deploy']).then( paths => {
    console.log('Deleted files:\n',paths.join('\n'));
    done();
  });
});

gulp.task('build:pages',() => {
  const destDir = 'dist';
	return gulp.src('.tmp/*.html')
		.pipe($.smoosher({
			ignoreFilesNotFound:true
		}))
    .pipe($.useref())
		.pipe($.if('*.js',$.uglify()))
		.pipe($.if('*.css',$.minify()))
		.pipe($.htmlmin({
			collapseWhitespace:true,
			removeComments:true,
			//removeAttributeQuotes:false,
			minifyJS:true,
			minifyCSS:true,
		}))
		.pipe($.size({
			gzip:true,
			showFiles:true,
			showTotal:true
		}))
		.pipe(gulp.dest(destDir));
});

gulp.task('build:copysource', () => {
  const complexpagesDir = 'dist/complex_pages';
  const templatesDir = 'dist/templates';

  const complexpagesStream = gulp.src('complex_pages/**.html')
    .pipe(gulp.dest(complexpagesDir));
  const templatesStream = gulp.src('views/templates/**.html')
    .pipe(gulp.dest(templatesDir));
  return merge(complexpagesStream,templatesStream);
});

gulp.task('publish', gulp.series('del','html','style','script','build:pages','build:copysource',()=>{
  const pagesDir = '../dev_cms/ad-management';
  const complexpagesDir = `${pagesDir}/complex_pages`;
  const templatesDir = `${pagesDir}/templates`;

  const pagesStream = gulp.src('dist/**.html')
    .pipe(gulp.dest(pagesDir));
  const complexpagesStream = gulp.src('dist/complex_pages/**.html')
    .pipe(gulp.dest(complexpagesDir));
  const templatesStream = gulp.src('dist/templates/**.html')
    .pipe(gulp.dest(templatesDir));
  return merge(pagesStream, complexpagesStream, templatesStream);
}));