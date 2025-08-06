# Framer Motion Integration Guide

## Tổng quan

Dự án HealthyFood đã được tích hợp **Framer Motion** để tạo ra các animation mượt mà và tương tác tốt hơn cho người dùng.

## Cài đặt

```bash
npm install framer-motion
```

## Cấu trúc Animation Components

### 1. AnimatedComponents.jsx

File này chứa tất cả các component animation có thể tái sử dụng:

#### Basic Animations
- `PageTransition` - Animation cho page transitions
- `FadeIn` - Fade in với delay tùy chỉnh
- `SlideInLeft` - Slide in từ trái
- `SlideInRight` - Slide in từ phải
- `ScaleIn` - Scale in từ 0.8 đến 1

#### Interactive Elements
- `AnimatedButton` - Button với hover và tap effects
- `AnimatedCard` - Card với hover effect
- `AnimatedModal` - Modal với enter/exit animations

#### Loading & Progress
- `LoadingSpinner` - Spinner animation
- `AnimatedProgressBar` - Progress bar với animation

#### Notifications
- `PulseNotification` - Pulse animation cho notifications
- `BounceSuccess` - Bounce animation cho success states

#### Lists
- `StaggeredList` - Container cho staggered animations
- `StaggeredItem` - Item trong staggered list

## Cách sử dụng

### 1. Basic Usage

```jsx
import { FadeIn, AnimatedButton } from '../components/AnimatedComponents';

function MyComponent() {
  return (
    <FadeIn delay={0.2}>
      <div>Content with fade in animation</div>
    </FadeIn>
  );
}
```

### 2. Interactive Elements

```jsx
import { AnimatedButton, AnimatedCard } from '../components/AnimatedComponents';

function MyComponent() {
  return (
    <AnimatedCard>
      <h3>Hover me!</h3>
      <AnimatedButton onClick={handleClick}>
        Click me!
      </AnimatedButton>
    </AnimatedCard>
  );
}
```

### 3. Loading States

```jsx
import { LoadingSpinner, AnimatedProgressBar } from '../components/AnimatedComponents';

function MyComponent() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      {loading ? (
        <LoadingSpinner size={50} color="#2C7BE5" />
      ) : (
        <AnimatedProgressBar progress={progress} />
      )}
    </div>
  );
}
```

### 4. Staggered Lists

```jsx
import { StaggeredList, StaggeredItem } from '../components/AnimatedComponents';

function MyList() {
  return (
    <StaggeredList>
      {items.map((item, index) => (
        <StaggeredItem key={index}>
          <div>{item}</div>
        </StaggeredItem>
      ))}
    </StaggeredList>
  );
}
```

### 5. Modals

```jsx
import { AnimatedModal } from '../components/AnimatedComponents';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AnimatedModal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div>Modal content</div>
    </AnimatedModal>
  );
}
```

## Custom Animation Hooks

### useAnimationVariants

```jsx
import { useAnimationVariants } from '../hooks/useAnimation';

function MyComponent() {
  const { fadeInUp, slideInLeft, scaleIn } = useAnimationVariants();

  return (
    <motion.div {...fadeInUp(0.2)}>
      Content with custom animation
    </motion.div>
  );
}
```

### useHoverAnimation

```jsx
import { useHoverAnimation } from '../hooks/useAnimation';

function MyComponent() {
  const { buttonHover, cardHover } = useHoverAnimation();

  return (
    <motion.div {...cardHover()}>
      <motion.button {...buttonHover()}>
        Hover me
      </motion.button>
    </motion.div>
  );
}
```

### useLoadingAnimation

```jsx
import { useLoadingAnimation } from '../hooks/useAnimation';

function MyComponent() {
  const { spinnerAnimation, pulseAnimation } = useLoadingAnimation();

  return (
    <motion.div {...spinnerAnimation()}>
      Loading...
    </motion.div>
  );
}
```

## Page Transitions

### App-level Transitions

```jsx
// App.jsx
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Routes */}
      </Routes>
    </AnimatePresence>
  );
};
```

### Page-level Transitions

```jsx
import { PageTransition } from '../components/AnimatedComponents';

function MyPage() {
  return (
    <PageTransition>
      <div>Page content</div>
    </PageTransition>
  );
}
```

## Performance Tips

### 1. Reduce Motion

```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={prefersReducedMotion ? {} : { x: 100 }}
>
  Content
</motion.div>
```

### 2. Optimize Re-renders

```jsx
import { memo } from 'react';

const MotionComponent = memo(({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {children}
  </motion.div>
));
```

### 3. Use Layout Animations Sparingly

```jsx
// Chỉ sử dụng layout animation khi cần thiết
<motion.div layout>
  <motion.div layoutId="shared">
    Content
  </motion.div>
</motion.div>
```

## Best Practices

### 1. Consistent Timing

```jsx
// Sử dụng timing nhất quán
const standardTransition = {
  duration: 0.3,
  ease: "easeInOut"
};
```

### 2. Meaningful Animations

```jsx
// Animation phải có ý nghĩa
<motion.div
  animate={{ opacity: isVisible ? 1 : 0 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

### 3. Accessibility

```jsx
// Luôn kiểm tra reduced motion preference
const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={shouldAnimate ? { x: 100 } : {}}
>
  Content
</motion.div>
```

## Debugging

### 1. Animation Inspector

```jsx
// Thêm debug prop để xem animation values
<motion.div
  animate={{ x: 100 }}
  onUpdate={(latest) => console.log(latest)}
>
  Content
</motion.div>
```

### 2. Performance Monitoring

```jsx
// Monitor animation performance
<motion.div
  animate={{ x: 100 }}
  onAnimationStart={() => console.log('Animation started')}
  onAnimationComplete={() => console.log('Animation completed')}
>
  Content
</motion.div>
```

## Examples trong dự án

### 1. Login Page
- Page transition khi load
- Form fields fade in với stagger
- Button hover effects
- Error modal với smooth animations

### 2. Blog Component
- Card hover effects
- Staggered list animations
- Like button interactions
- Modal transitions

### 3. Dashboard
- Chart animations
- Loading spinners
- Progress bars
- Data transitions

## Troubleshooting

### 1. Animation không chạy
- Kiểm tra import framer-motion
- Đảm bảo component được wrap trong AnimatePresence nếu cần
- Kiểm tra console errors

### 2. Performance Issues
- Sử dụng `transform` thay vì `left/top`
- Tránh animate `width/height` khi có thể
- Sử dụng `will-change` CSS property

### 3. Layout Shifts
- Sử dụng `layout` prop cẩn thận
- Kiểm tra initial state của animation
- Đảm bảo container có kích thước cố định

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Examples](https://www.framer.com/motion/examples/)
- [Performance Guide](https://www.framer.com/motion/performance/)
- [Gesture Support](https://www.framer.com/motion/gestures/) 