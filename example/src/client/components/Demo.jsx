import React from 'react';
import CropSelector from '../../../..';
import GithubCorner from './GithubCorner';
import PokiLogo from './PokiLogo';
import styles from '../styles/demo.css';

export default function Demo() {
	const example1 = `import React from 'react';
import CropSelector from 'react-crop-selector';

export default function MyComponent() {
    return (
        <CropSelector
            width={640} height={480}
            x1={5} y1={5} x2={95} y2={95}
        />
    );
}`;

	const example2 = `import React from 'react';
import CropSelector from 'react-crop-selector';

export default function MyComponent() {
    return (
        <CropSelector
            width={640} height={480}
            x1={5} y1={5} x2={95} y2={95}
            ratio="5:3"
        />
    );
}`;

	const example3 = `import React from 'react';
import CropSelector from 'react-crop-selector';

export default function MyComponent() {
    return (
        <CropSelector
            width={640} height={480}
            x1={5} y1={5} x2={95} y2={95}
            minWidth={50} minHeight={50}
        />
    );
}`;

	const example4 = `import React from 'react';
import CropSelector from 'react-crop-selector';

export default function MyComponent() {
    return (
        <CropSelector
            width={640} height={480}
            x1={5} y1={5} x2={95} y2={95}
            guide="rule-of-thirds"
        />
    );
}`;

	return (
		<div>
			<GithubCorner />
			<PokiLogo className={styles.logo} />
			<h1 className={styles.name}>
				react-crop-selector
			</h1>

			<p className={styles.intro}>
				<code>react-crop-selector</code> helps users define crop boundaries in an image (or
				technically just in any area). It does not actually do any cropping at all, but rather
				it gives you the tools to build something like that yourself with it.
			</p>

			<figure className={styles.cropper} style={{ background: 'url(https://unsplash.it/640/480/?image=1062)' }}>
				<CropSelector width={640} height={480} x1={5} y1={5} x2={95} y2={95} />
			</figure>

			<div className={styles.code}>
				<pre><code>{example1}</code></pre>
			</div>

			<h2>Fixed aspect ratio</h2>

			<p className={styles.intro}>
				<code>react-crop-selector</code> supports aspect ratio locking. Simply pass
				the <code>ratio</code> prop to the component in the form of <code>width:height</code> and
				it will make sure that the ratio is always maintained. Additionally, the drag
				handles on the top, left, right and bottom sides will be hidden.
			</p>

			<figure className={styles.cropper} style={{ background: 'url(https://unsplash.it/640/480/?image=1025)' }}>
				<CropSelector
					width={640}
					height={480}
					x1={5}
					y1={5}
					x2={95}
					y2={95}
					ratio="5:3"
				/>
			</figure>

			<div className={styles.code}>
				<pre><code>{example2}</code></pre>
			</div>

			<h2>Minimum dimensions</h2>

			<p className={styles.intro}>
				<code>react-crop-selector</code> supports setting minimum dimensions the crop
				has to have. Pass the <code>minWidth</code> and <code>minHeight</code> properties in order
				to enable this. These properties are defined as a percentage.
			</p>

			<figure className={styles.cropper} style={{ background: 'url(https://unsplash.it/640/480/?image=1020)' }}>
				<CropSelector
					width={640}
					height={480}
					x1={5}
					y1={5}
					x2={95}
					y2={95}
					minWidth={50}
					minHeight={50}
				/>
			</figure>

			<div className={styles.code}>
				<pre><code>{example3}</code></pre>
			</div>

			<h2>Guides</h2>

			<p className={styles.intro}>
				<code>react-crop-selector</code> supports setting guides while dragging. Currently
				only the "<a href="https://en.wikipedia.org/wiki/Rule_of_thirds">rule of thirds</a>"
				guide is supported. You can enable it by setting the <code>guide</code> prop
				to <code>rule-of-thirds</code>.
			</p>

			<figure className={styles.cropper} style={{ background: 'url(https://unsplash.it/640/480/?image=937)' }}>
				<CropSelector
					width={640}
					height={480}
					x1={5}
					y1={5}
					x2={95}
					y2={95}
					guide="rule-of-thirds"
				/>
			</figure>

			<div className={styles.code}>
				<pre><code>{example4}</code></pre>
			</div>
		</div>
	);
}
