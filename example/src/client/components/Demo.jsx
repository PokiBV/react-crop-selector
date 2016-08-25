import React from 'react';
import GithubCorner from './GithubCorner';
import PokiLogo from './PokiLogo';
import styles from '../styles/demo.css';

export default function Demo() {
	return (
		<div>
			<GithubCorner />
			<PokiLogo className={styles.logo} />
			<p className={styles.name}>
				react-crop-selector
			</p>
		</div>
	);
}
