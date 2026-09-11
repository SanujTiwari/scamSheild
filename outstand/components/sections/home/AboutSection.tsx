import Image from 'next/image';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
      <section className={styles.aboutSection} id="about">
        <div className={styles.r1}>
          <div className={styles.r2}>
            <div className={styles.dektop}>
              <div className={styles.tag} data-border="true">
                <div className={styles.icon}>
                  <div className={styles.r6}>
                    <Image className={styles.r7} src="/assets/media/kXzKnSo8AYBBiRWPv9cmra68Z38.svg" alt="Icon" width={20} height={20} />
                  </div>
                </div>
                <div className={styles.text}>
                  <p className={styles.r9}>
                    About us
                  </p>
                </div>
              </div>
              <div className={styles.textContainer}>
                <div className={styles.heading}>
                  <h2 className={styles.r12}>
                    About JobShield AI Security
                  </h2>
                </div>
                <div className={styles.paragraph}>
                  <p className={styles.r14}>
                    At JobShield, we are dedicated to protecting job seekers from recruitment fraud, upfront payment scams, phishing recruiters, and fake job postings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.subContainer}>
          <div className={styles.container}>
            <div className={styles.r1}>
              <div className={styles.image}>
                <div className={styles.r18}>
                  <Image className={styles.r19} src="/assets/media/cLYzyomAKkuIY6hVgkscLfTmpQ.jpg" alt="About Us Image" width={545} height={363} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.container2}>
            <div className={styles.subContainer2}>
              <div className={styles.card}>
                <div className={styles.textContainer2}>
                  <div className={styles.heading2}>
                    <h3 className={styles.r25}>
                      10K+
                    </h3>
                  </div>
                  <div className={styles.text2}>
                    <h4 className={styles.r27}>
                      Scams Flagged
                    </h4>
                  </div>
                </div>
                <div className={styles.line} />
                <div className={styles.paragraph2}>
                  <p className={styles.r30}>
                    JobShield has analyzed thousands of listings to shield job seekers from financial and identity fraud.
                  </p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.textContainer2}>
                  <div className={styles.heading2}>
                    <h3 className={styles.r25}>
                      99.4%
                    </h3>
                  </div>
                  <div className={styles.text2}>
                    <h4 className={styles.r27}>
                      Detection Accuracy
                    </h4>
                  </div>
                </div>
                <div className={styles.line} />
                <div className={styles.paragraph2}>
                  <p className={styles.r30}>
                    Advanced multi-source AI algorithms cross-check indicators with high precision.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.subContainer2}>
              <div className={styles.card}>
                <div className={styles.textContainer2}>
                  <div className={styles.heading2}>
                    <h3 className={styles.r25}>
                      100%
                    </h3>
                  </div>
                  <div className={styles.text2}>
                    <h4 className={styles.r27}>
                      Free & Confidential
                    </h4>
                  </div>
                </div>
                <div className={styles.line} />
                <div className={styles.paragraph2}>
                  <p className={styles.r30}>
                    Zero fees for job seekers. Perform instant anonymous checks anytime.
                  </p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.textContainer2}>
                  <div className={styles.heading2}>
                    <h3 className={styles.r25}>
                      6+
                    </h3>
                  </div>
                  <div className={styles.text2}>
                    <h4 className={styles.r27}>
                      AI Scanner Engines
                    </h4>
                  </div>
                </div>
                <div className={styles.line} />
                <div className={styles.paragraph2}>
                  <p className={styles.r30}>
                    Job postings, recruiter identity, upfront fees, WHOIS domain age, URL security, and community reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
