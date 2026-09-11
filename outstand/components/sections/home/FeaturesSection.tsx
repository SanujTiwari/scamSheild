import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturesSection.module.css';

export default function FeaturesSection() {
  return (
      <section className={styles.featuresSection} id="features">
        <div className={styles.r1}>
          <div className={styles.r2}>
            <div className={styles.dektop}>
              <div className={styles.tag} data-border="true">
                <div className={styles.icon}>
                  <div className={styles.r6}>
                    <Image className={styles.r7} src="/assets/media/GeiRPq7ay3bsEgoZEZhYSdzWk.png" alt="Icon" width={512} height={512} />
                  </div>
                </div>
                <div className={styles.text}>
                  <p className={styles.r9}>
                    Features
                  </p>
                </div>
              </div>
              <div className={styles.textContainer}>
                <div className={styles.heading}>
                  <h2 className={styles.r12}>
                    Top Features of JobShield AI
                  </h2>
                </div>
                <div className={styles.paragraph}>
                  <p className={styles.r14}>
                    Discover how our multi-indicator security engines protect your career search from dangerous fraud.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.subContainer}>
          <div className={styles.card} data-border="true">
            <div className={styles.container}>
              <div className={styles.textContainer2}>
                <div className={styles.heading2}>
                  <h3 className={styles.r20}>
                    Start your job search with complete peace of mind
                  </h3>
                </div>
                <div className={styles.paragraph2}>
                  <p className={styles.r22}>
                    Multi-source AI indicators evaluate job offers, recruiter credentials, fees, and links before you apply.
                  </p>
                </div>
              </div>
              <div className={styles.container2}>
                <div className={styles.subContainer2}>
                  <div className={styles.icon2}>
                    <div className={styles.r26}>
                      <Image className={styles.r27} src="/assets/media/1dNFxWV0EEWbhb6n3h7QTD6XbI.svg" alt="Tick Icon" width={30} height={30} />
                    </div>
                  </div>
                  <div className={styles.text2}>
                    <p className={styles.r29}>
                      Multi-Indicator Scanning
                    </p>
                  </div>
                </div>
                <div className={styles.subContainer3}>
                  <div className={styles.icon2}>
                    <div className={styles.r26}>
                      <Image className={styles.r27} src="/assets/media/1dNFxWV0EEWbhb6n3h7QTD6XbI.svg" alt="Tick Icon" width={30} height={30} />
                    </div>
                  </div>
                  <div className={styles.text3}>
                    <p className={styles.r32}>
                      Instant Risk Score (0-100)
                    </p>
                  </div>
                </div>
                <div className={styles.subContainer4}>
                  <div className={styles.icon2}>
                    <div className={styles.r26}>
                      <Image className={styles.r27} src="/assets/media/1dNFxWV0EEWbhb6n3h7QTD6XbI.svg" alt="Tick Icon" width={30} height={30} />
                    </div>
                  </div>
                  <div className={styles.text4}>
                    <p className={styles.r35}>
                      Community Threat Intelligence
                    </p>
                  </div>
                </div>
                <div className={styles.subContainer5}>
                  <div className={styles.icon2}>
                    <div className={styles.r26}>
                      <Image className={styles.r27} src="/assets/media/1dNFxWV0EEWbhb6n3h7QTD6XbI.svg" alt="Tick Icon" width={30} height={30} />
                    </div>
                  </div>
                  <div className={styles.text5}>
                    <p className={styles.r38}>
                      100% Free Security Checks
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.r1}>
              <div className={styles.r39}>
                <Link className={styles.iconLeftRight} data-border="true" href="#scanners">
                  <div className={styles.text6}>
                    <p className={styles.r42}>
                      Try Job Scanner
                    </p>
                  </div>
                  <div className={styles.iconRight}>
                    <div className={styles.icon}>
                      <div className={styles.r6}>
                        <Image className={styles.r44} src="/assets/media/lJSvGFGPhRLFfxcyPg1nppxYdA.svg" alt="" width={20} height={20} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.container3}>
            <div className={styles.subContainer6}>
              <div className={styles.card2}>
                <div className={styles.icon3}>
                  <div className={styles.r49}>
                    <Image className={styles.r50} src="/assets/media/jIcWuO1W1WaV9KooReW8RRQC76U.svg" alt="Icon" width={28} height={28} />
                  </div>
                </div>
                <div className={styles.textContainer3}>
                  <div className={styles.r1}>
                    <div className={styles.heading3}>
                      <h3 className={styles.r53}>
                        Multi-Source Indicators
                      </h3>
                    </div>
                  </div>
                  <div className={styles.paragraph3}>
                    <p className={styles.r55}>
                      Combines salary analysis, recruiter identity match, fee detection, and link security into one report.
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.line} data-border="true" />
              <div className={styles.card3}>
                <div className={styles.icon3}>
                  <div className={styles.r49}>
                    <Image className={styles.r50} src="/assets/media/RMLMBoeg6AaBvvj9Ri5BysKkMc.svg" alt="Icon" width={28} height={28} />
                  </div>
                </div>
                <div className={styles.textContainer4}>
                  <div className={styles.r1}>
                    <div className={styles.heading3}>
                      <h3 className={styles.r53}>
                        Data-Driven Risk Scoring
                      </h3>
                    </div>
                  </div>
                  <div className={styles.paragraph4}>
                    <p className={styles.r60}>
                      Calculates normalized risk levels from low to critical with detailed red-flag explanations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.line2} data-border="true" />
            <div className={styles.subContainer7}>
              <div className={styles.card4}>
                <div className={styles.icon4}>
                  <div className={styles.r65}>
                    <Image className={styles.r66} src="/assets/media/9ingRzlfybhYw4nDq2FEvLen0Q.svg" alt="Icon" width={28} height={28} />
                  </div>
                </div>
                <div className={styles.textContainer3}>
                  <div className={styles.r1}>
                    <div className={styles.heading3}>
                      <h3 className={styles.r53}>
                        Domain & WHOIS Verification
                      </h3>
                    </div>
                  </div>
                  <div className={styles.paragraph3}>
                    <p className={styles.r55}>
                      Inspects corporate web domain creation dates and SSL certificates to flag fake company websites.
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.line3} data-border="true" />
              <div className={styles.card3}>
                <div className={styles.icon3}>
                  <div className={styles.r49}>
                    <Image className={styles.r50} src="/assets/media/PHiP4RMipNd4mFhYxOMnCoaO3I8.svg" alt="Icon" width={28} height={28} />
                  </div>
                </div>
                <div className={styles.textContainer4}>
                  <div className={styles.r1}>
                    <div className={styles.heading3}>
                      <h3 className={styles.r53}>
                        Actionable Safety Advice
                      </h3>
                    </div>
                  </div>
                  <div className={styles.paragraph4}>
                    <p className={styles.r60}>
                      Provides plain-language recommendations so job seekers know exactly how to handle suspicious offers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
