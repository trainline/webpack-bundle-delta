/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import webpack4 from 'webpack4';
/* eslint-enable import/no-extraneous-dependencies */

export type Stats5 = ReturnType<webpack.Stats['toJson']>;
export type Stats4 = webpack4.Stats.ToJsonOutput;
export type Stats = Stats5 | Stats4;
export type Asset = Stats4['assets'][0] | Stats5['assets'][0];
export type Module = Stats4['modules'][0] | Stats5['modules'][0];

export const FILENAME_QUERY_REGEXP = /\?.*$/u;
export const FILENAME_JS_MJS_EXTENSIONS = /\.(js|mjs)$/iu;
export const FILENAME_JS_MJS_CSS_EXTENSIONS = /\.(js|mjs|css)$/iu;

export enum SupportedExtensions {
  js = 'js',
  mjs = 'mjs',
  css = 'css',
}
