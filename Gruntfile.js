/* jshint node: true */
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    clean: {
      dist: ['dist']
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['public/bootstrap/js/*.js']
      },
      test: {
        src: ['public/bootstrap/js/tests/unit/*.js']
      }
    },

    concat: {
      options: {
        banner: 'easy analytics bootstrap',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'public/bootstrap/js/transition.js',
          'public/bootstrap/js/alert.js',
          'public/bootstrap/js/button.js',
          'public/bootstrap/js/carousel.js',
          'public/bootstrap/js/collapse.js',
          'public/bootstrap/js/dropdown.js',
          'public/bootstrap/js/modal.js',
          'public/bootstrap/js/tooltip.js',
          'public/bootstrap/js/popover.js',
          'public/bootstrap/js/scrollspy.js',
          'public/bootstrap/js/tab.js',
          'public/bootstrap/js/affix.js'
        ],
        dest: 'public/bootstrap/dist/js/bootstrap.js'
      }
    },

    uglify: {
      options: {
        banner: 'easy analytics bootstrap',
        report: 'min'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'public/bootstrap/dist/js/bootstrap.min.js'
      }
    },

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>'
      },
      bootstrap: {
        src: ['public/bootstrap/less/bootstrap.less'],
        dest: 'public/bootstrap/dist/css/bootstrap.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['public/bootstrap/less/bootstrap.less'],
        dest: 'public/bootstrap/dist/css/bootstrap.min.css'
      },
      theme: {
        src: ['public/bootstrap/less/theme.less'],
        dest: 'public/bootstrap/dist/css/bootstrap-theme.css'
      },
      theme_min: {
        options: {
          compress: true
        },
        src: ['public/bootstrap/less/theme.less'],
        dest: 'public/bootstrap/dist/css/bootstrap-theme.min.css'
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: ["fonts/*"],
        dest: 'public/bootstrap/dist/'
      }
    },

    qunit: {
      options: {
        inject: 'public/bootstrap/js/tests/unit/phantom.js'
      },
      files: ['public/bootstrap/js/tests/*.html']
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      recess: {
        files: 'public/bootstrap/less/*.less',
        tasks: ['recess']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Fonts distribution task.
  grunt.registerTask('dist-fonts', ['copy']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-fonts', 'dist-js']);
};
