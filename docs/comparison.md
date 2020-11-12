# Comparison

Whilst the idea of this package is not new, we felt what was presently out there wasn't entirely holistic or easy for developers to know the impact of their changes.

There are many notable solutions out there that might work well enough for your needs
- [budlesize](https://github.com/siddharthkp/bundlesize)
- [webpack-bundle-diff](https://github.com/smikula/webpack-bundle-diff)
- [bundle-stats](https://github.com/relative-ci/bundle-stats)
- [origami-bundle-size-cli](https://github.com/Financial-Times/origami-bundle-size-cli)
- [size-plugin](https://github.com/GoogleChromeLabs/size-plugin)

## Comparison table

| Feature / Tool                                 	| `webpack-bundle-delta` 	| `bundlesize` 	| `webpack-bundle-diff` 	| `bundle-stats` 	| `origami-bundle-size-cli` 	| `size-plugin` 	|
|------------------------------------------------	|:----------------------:	|:------------:	|:---------------------:	|:--------------:	|:-------------------------:	|:-------------:	|
| Monitor file sizes                             	|            ✔           	|       ✔      	|           ✔           	|        ✔       	|             ✔             	|       ✔       	|
| Show size delta/diff between two build outputs 	|            ✔           	|              	|           ✔           	|        ✔       	|             ?             	|       ✔       	|
| Compare local webpack stats files              	|            ✔           	|              	|           ✔           	|        ✔       	|                           	|               	|
| Compare remote webpack stats files             	|            ✔           	|              	|                       	|                	|                           	|               	|
| Output to CLI                                  	|            ✔           	|       ✔      	|           ✔           	|                	|             ✔             	|       ✔       	|
| Output as HTML/markdown                        	|                        	|              	|           ✔           	|        ✔       	|                           	|               	|
| Output as JSON                                 	|                        	|              	|           ✔           	|        ✔       	|                           	|               	|
| Output to Pull Request                         	|            ✔           	|              	|                       	|                	|                           	|               	|
| Warn/Error on chunk size budget                	|            ✔           	|       ✔      	|                       	|                	|                           	|               	|
| Trace changes in each chunk                    	|            ✔           	|              	|           ✔           	|        ✔       	|                           	|               	|
| Duplication detection                          	|            ✔           	|              	|                       	|        ✔       	|                           	|               	|
| Remap suggestions                              	|            ✔           	|              	|                       	|                	|                           	|               	|
| Restrict file inclusions                       	|            ✔           	|              	|                       	|                	|                           	|               	|
| Plugin support (add your own features)         	|            ✔           	|              	|                       	|                	|                           	|               	|

The table is a general point of view and some aspects can be worked around:
- Compare remote webpack stats files: this can be overcome by dumping the base stats file into the working directory before doing the comparison
- Output to Pull Request: Any of these tools could be wrapped locally to use `danger.js` or [octokit/rest.js](https://github.com/octokit/rest.js/) but still requires additional setup and formatting of the output
- Tools such as `bundle-stats` offer more usages via their [SaaS relative-ci.com](https://relative-ci.com/), so we encourage people to do their research as well to find the best tool for their needs
