// Разрешает импорт CSS-файлов в TypeScript (import './style.css').
// Сами стили подключает webpack через css-loader и style-loader.
declare module '*.css';
