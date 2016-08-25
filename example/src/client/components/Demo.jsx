import React from 'react';
import CropSelector from '../../../..';
import GithubCorner from './GithubCorner';
import PokiLogo from './PokiLogo';
import styles from '../styles/demo.css';

export default function Demo() {
	const example = `import React from 'react';
import CropSelector from 'react-crop-selector';

export default function MyComponent() {
    return (
        <CropSelector
            width={640} height={480}
            x1={5} y1={5} x2={95} y2={95}
        />
    );
}`;

	return (
		<div>
			<GithubCorner />
			<PokiLogo className={styles.logo} />
			<p className={styles.name}>
				react-crop-selector
			</p>

			<p className={styles.intro}>
				<code>react-crop-selector</code> helps users define crop boundaries in an image (or
				technically just in any area). It does not actually do any cropping at all, but rather
				it gives you the tools to build something like that yourself with it.
			</p>

			<figure className={styles.cropper}>
				<CropSelector width={640} height={480} x1={5} y1={5} x2={95} y2={95} />
			</figure>

			<div className={styles.code}>
				<pre><code>{example}</code></pre>
			</div>
		</div>
	);
}
