
module.exports = function configure(grunt) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-connect');

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  grunt.initConfig({

    /**
     * The directory to which we throw our compiled project files.
     */
    distdir: 'dist',

    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    environment: grunt.option('e') ||
      grunt.option('environment') ||
      'development',

    /**
     * This is a collection of file definitions we use in the configuration of
     * build tasks. `js` is all project javascript, less tests. `atpl` contains
     * our reusable components' template HTML files, while `ctpl` contains the
     * same, but for our app's code. `html` is just our main HTML file and
     * `less` is our main stylesheet.
     */
    src: {
      js: [ 'index.js', 'src/services/*.js', 'src/directives/*.js' ],
      unit: [ 'tests/unit/**/*.test.js' ]
    },

    /**
     * The directory to delete when `grunt clean` is executed.
     */
    clean: [ '<%= distdir %>' ],

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `dist` target is the concatenation of our application source code
       * into a single file. All files matching what's in the `src.js`
       * configuration property above will be included in the final build.
       *
       * In addition, the source is surrounded in the blocks specified in the
       * `module.prefix` and `module.suffix` files, which are just run blocks
       * to ensure nothing pollutes the global scope.
       *
       * The `options` array allows us to specify some customization for this
       * operation. In this case, we are adding a banner to the top of the file,
       * based on the above definition of `meta.banner`. This is simply a
       * comment with copyright informaiton.
       */
      dist: {
        options: {},
        src: [
          'module.prefix', '<%= src.js %>', 'module.suffix'
        ],
        dest: '<%= distdir %>/assets/<%= pkg.name %>.js'
      }

    },

    /**
     * Use ng-min to annotate the sources before minifying
     */
    ngmin: {
      dist: {
        src: [ '<%= distdir %>/assets/<%= pkg.name %>.js' ],
        dest: '<%= distdir %>/assets/<%= pkg.name %>.annotated.js'
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      options: {
      },
      dist: {
        files: {
          '<%= distdir %>/assets/<%= pkg.name %>.min.js': [
            '<%= distdir %>/assets/<%= pkg.name %>.annotated.js'
          ]
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we should
     * check. This file, all java script sources, and all our unit tests are
     * linted based on the policies listed in `options`. But we can allow
     * specify exclusionary patterns for external components by prefixing them
     * with an exclamation point (!).
     */
    jshint: {
      src: [
        'Gruntfile.js',
        '<%= src.js %>',
        '<%= src.unit %>',
        '!src/components/placeholders/**/*'
      ],
      test: [
        '<%= src.unit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        browser: true,
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {
        angular: true
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: 'config/karma_unit.conf.js',
        runnerPort: 9101
      },
      unit: {
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729.
       */
      options: {
         livereload: 35730
      },

      /**
       * When the Gruntfile changes, we just want to lint it. That said, the
       * watch will have to be restarted if it should take advantage of any of
       * the changes.
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our source files change, we want to run most of our build tasks
       * (excepting uglification).
       */
      src: {
        files: [
          '<%= src.js %>'
        ],
        tasks: [
          'jshint:src',
          'concat:dist',
          'karma:unit:run',
          'ngmin:dist',
          'uglify:dist'
        ]
      },

      /**
       * When a unit test file changes, we only want to lint it and run the
       * unit tests. However, since the `app` module requires the compiled
       * templates, we must also run the `html2js` task.
       */
      unittest: {
        files: [
          '<%= src.unit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }
    }
  });

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', [
    'default',
    'karma:unit',
    'delta'
  ]);

  /**
   * The default task is to build.
   */
  grunt.registerTask('default', [ 'build' ]);
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'concat',
    'ngmin:dist',
    'uglify'
  ]);

  /**
   * A task to build the project, without some of the slower processes. This is
   * used during development and testing and is part of the `watch`.
   */
  grunt.registerTask('quick-build', [
    'clean', 'jshint', 'test', 'concat'
  ]);

};
