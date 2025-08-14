import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PageTransition, 
  FadeIn, 
  SlideInLeft, 
  SlideInRight, 
  ScaleIn,
  AnimatedButton,
  AnimatedCard,
  LoadingSpinner,
  AnimatedProgressBar,
  PulseNotification,
  BounceSuccess,
  StaggeredList,
  StaggeredItem,
  AnimatedModal
} from './AnimatedComponents';

const AnimationDevTools = () => {
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <PageTransition>
      <div style={{ 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '0 auto',
        border: '2px solid #2C7BE5',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          backgroundColor: '#2C7BE5', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '6px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <strong>🎨 Animation Development Tools</strong>
          <br />
          <small>Chỉ hiển thị trong development mode</small>
        </div>
        
        <h1>Framer Motion Dev Tools</h1>
        
        {/* Basic Animations */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Basic Animations</h2>
          
          <FadeIn delay={0.2}>
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
              <h3>Fade In Animation</h3>
              <p>This content fades in with a delay</p>
            </div>
          </FadeIn>

          <SlideInLeft delay={0.4}>
            <div style={{ padding: '20px', backgroundColor: '#e3f2fd', marginBottom: '20px' }}>
              <h3>Slide In Left</h3>
              <p>This content slides in from the left</p>
            </div>
          </SlideInLeft>

          <SlideInRight delay={0.6}>
            <div style={{ padding: '20px', backgroundColor: '#f3e5f5', marginBottom: '20px' }}>
              <h3>Slide In Right</h3>
              <p>This content slides in from the right</p>
            </div>
          </SlideInRight>

          <ScaleIn delay={0.8}>
            <div style={{ padding: '20px', backgroundColor: '#e8f5e8', marginBottom: '20px' }}>
              <h3>Scale In</h3>
              <p>This content scales in from 0.8 to 1</p>
            </div>
          </ScaleIn>
        </section>

        {/* Interactive Elements */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Interactive Elements</h2>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <AnimatedButton onClick={() => alert('Button clicked!')}>
              Hover Me
            </AnimatedButton>
            
            <AnimatedButton onClick={handleProgress}>
              Start Progress
            </AnimatedButton>
            
            <AnimatedButton onClick={() => setShowModal(true)}>
              Open Modal
            </AnimatedButton>
          </div>

          <AnimatedCard style={{ padding: '20px', backgroundColor: '#fff3e0', border: '1px solid #ddd' }}>
            <h3>Hover Card</h3>
            <p>Hover over this card to see the animation</p>
          </AnimatedCard>
        </section>

        {/* Loading & Progress */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Loading & Progress</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Loading Spinner</h3>
            <LoadingSpinner size={60} color="#2C7BE5" />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Progress Bar</h3>
            <AnimatedProgressBar progress={progress} />
            <p>Progress: {progress}%</p>
          </div>
        </section>

        {/* Notifications */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Notifications</h2>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <PulseNotification>
              <div style={{ padding: '10px', backgroundColor: '#2196f3', color: 'white', borderRadius: '4px' }}>
                Pulse Notification
              </div>
            </PulseNotification>
            
            <BounceSuccess>
              <div style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', borderRadius: '4px' }}>
                Success Animation
              </div>
            </BounceSuccess>
          </div>
        </section>

        {/* Staggered List */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Staggered List</h2>
          
          <StaggeredList>
            {['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'].map((item, index) => (
              <StaggeredItem key={index}>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#f5f5f5', 
                  marginBottom: '10px',
                  borderRadius: '4px'
                }}>
                  {item}
                </div>
              </StaggeredItem>
            ))}
          </StaggeredList>
        </section>

        {/* Custom Motion Examples */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Custom Motion Examples</h2>
          
          <motion.div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#ff6b6b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '20px'
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              borderRadius: ['50%', '20%', '50%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Bounce
          </motion.div>

          <motion.div
            style={{
              width: '200px',
              height: '50px',
              backgroundColor: '#4ecdc4',
              borderRadius: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: '#45b7aa'
            }}
            whileTap={{
              scale: 0.9
            }}
          >
            Interactive Button
          </motion.div>
        </section>

        {/* Modal */}
        <AnimatedModal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '8px',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h2>Animated Modal</h2>
            <p>This modal has smooth enter/exit animations!</p>
            <AnimatedButton onClick={() => setShowModal(false)}>
              Close Modal
            </AnimatedButton>
          </div>
        </AnimatedModal>
      </div>
    </PageTransition>
  );
};

export default AnimationDevTools; 