/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

export const FILENAME_QUERY_REGEXP = /\?.*$/u;
export const FILENAME_JS_MJS_EXTENSIONS = /\.(js|mjs)$/iu;
export const FILENAME_JS_MJS_CSS_EXTENSIONS = /\.(js|mjs|css)$/iu;

export enum SupportedExtensions {
  js = 'js',
  mjs = 'mjs',
  css = 'css',
}
