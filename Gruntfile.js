/* jshint esversion: 6 */

/// <binding BeforeBuild='default' />
module.exports = function (grunt) {
    const sass = require('sass');
    
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: { 
            debug: {
                src: ["dist/*"] 
            },
            release: {
                src: ["dist/*", "Publish"]
            }
        },

        sass: {
            options: {
                implementation: sass,
                sourceMap: false, // Create source map
                outputStyle: 'compressed' // Minify output
            },
            dist: {
                files: [{
                    expand: true, // Recursive
                    cwd: "src/content/sass", // The startup directory
                    src: ["*.scss"], // Source files
                    dest: "dist/content/css", // Destination
                    ext: ".min.css", // File extension
                }]
            }
        },

        copy: {
            release: {
                files: [
                    // js
                    { expand: true, flatten: true, src: 'node_modules/@fortawesome/fontawesome-free/js/all.min.js', dest: 'dist/content/js', filter: 'isFile' },
                    { expand: true, flatten: true, src: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', dest: 'dist/content/js', filter: 'isFile' },
                    { expand: true, flatten: true, src: 'node_modules/bootstrap4-toggle/js/bootstrap4-toggle.min.js', dest: 'dist/content/js', filter: 'isFile' },
                    { expand: true, flatten: true, src: 'node_modules/jquery/dist/jquery.min.js', dest: 'dist/content/js', filter: 'isFile' },
                    { expand: true, flatten: true, src: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js', dest: 'dist', filter: 'isFile' },

                    // css
                    { expand: true, flatten: true, src: 'node_modules/bootstrap/dist/css/bootstrap.min.css', dest: 'dist/content/css', filter: 'isFile' },
                    { expand: true, flatten: true, src: 'node_modules/bootstrap4-toggle/css/bootstrap4-toggle.min.css', dest: 'dist/content/css', filter: 'isFile' },

                    // content
                    { expand: true, flatten: true, src: 'src/*.html', dest: 'dist', filter: 'isFile' },
                    { expand: true, flatten: true, src: 'src/manifest.json', dest: 'dist', filter: 'isFile' },
                    
                    // images
                    { expand: true, flatten: true, src: 'src/content/assets/images/*', dest: 'dist/content/assets/images', filter: 'isFile' },
                ]
            },
            debug: {
                files: [
                    // debug
                    { expand: true, flatten: false, cwd: "src", src: '**/*.js', dest: 'dist', filter: 'isFile' },
                ]
            }
        },

        uglify: {
            options: {
                compress: {
                    //beautify: true,
                    drop_console: false
                }
            },
            dist: {
                files: [{
                        expand: true, // Recursive
                        cwd: "src", // The startup directory
                        src: ["**/*.js"], // Source files
                        dest: "dist", // Destination
                    }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['src/content/css/*.css'],
                    dest: 'dist/content/css',
                    filter: 'isFile'
                }]
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'src/content/**/*.js'] 
        },

        watch: {
            debug: {
                files: [
                    'Gruntfile.js',
                    'src/**/*.*'
                ],
                tasks: ['debug'],
                options: {
                    //spawn: false,
                },
            }
        },

        shell: {
            ps: {
                options: {
                    stdout: true
                },
                command: 'powershell.exe -File CreatePackage.ps1'
            }
        }
    });

    // debug group task
    grunt.registerTask('debug', ['jshint', 'clean:debug', 'sass', 'copy', 'cssmin']);

    // release group task
    grunt.registerTask('release', ['clean:release', 'sass', 'copy:release', 'uglify', 'cssmin', 'shell:ps']);

    // review group task
    grunt.registerTask('review', ['clean:release', 'sass', 'copy:release', 'uglify', 'cssmin']);
};