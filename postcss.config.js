import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
// import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    postcssImport,
    autoprefixer,
    // process.env.NODE_ENV === 'production' &&
    //   purgecss({
    //     content: [
    //       './src/**/*.html',
    //       './src/**/*.js',
    //       './src/**/*.jsx',
    //       './src/**/*.tsx',
    //       './src/**/*.scss',
    //     ],
    //     safelist: ['safelist-class1', 'safelist-class2'], // Add any classes you want to exclude from purging
    //   }),
  ].filter(Boolean), // Remove false values from the plugins array
};