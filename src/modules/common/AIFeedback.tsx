// import React, { useState, useEffect } from 'react';
// import { Box, Button, CircularProgress, Typography } from '@mui/material';
// import SmartToyIcon from '@mui/icons-material/SmartToy';
// import { mutations } from '@/config/queryClient';
// import { GPTVersion } from '@graasp/sdk';

// // Props definition
// interface AIInputFeedbackProps {
//   inputText: string;
// }

// // Placeholder API call
// const fetchAIFeedback = async (input: string): Promise<string> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(`Here is some feedback on your input: "${input}". Consider improving clarity and structure.`);
//     }, 2000); // Simulated delay
//   });
// };

// const AIInputFeedback: React.FC<AIInputFeedbackProps> = ({ inputText }) => {
//   const [loading, setLoading] = useState(false);
//   const [feedback, setFeedback] = useState('');
//   const [animatedFeedback, setAnimatedFeedback] = useState('');
//   const { mutateAsync: postChatBot } = mutations.usePostChatBot(
//     GPTVersion.GPT_4_O, // TODO: Allow user to choose which model to use.
//   );

//   const getFeedback = async (text: string): Promise<string> => {

//   const handleClick = async (): Promise<void> => {
//     setLoading(true);
//     setFeedback('');
//     setAnimatedFeedback('');
//     try {
//       const result = await fetchAIFeedback(inputText);
//       setFeedback(result);
//     } catch (error) {
//       setFeedback('Failed to get feedback. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Typing animation effect
//   useEffect(() => {
//     if (!feedback) return () => {};

//     let index = 0;
//     const interval = setInterval(() => {
//       setAnimatedFeedback((prev) => prev + feedback[index]);
//       index += 1;
//       if (index >= feedback.length) clearInterval(interval);
//     }, 30); // Typing speed

//     return () => clearInterval(interval);
//   }, [feedback]);

//   return (
//     <Box
//       sx={{
//         border: '1px solid #ccc',
//         borderRadius: 2,
//         p: 2,
//         position: 'relative',
//         minHeight: '100px',
//         backgroundColor: '#fafafa',
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleClick}
//           startIcon={<SmartToyIcon />}
//           disabled={loading}
//         >
//           {loading ? 'Requesting...' : 'Get AI Feedback'}
//         </Button>
//       </Box>

//       <Box sx={{ mt: 1 }}>
//         {loading ? (
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <CircularProgress size={20} sx={{ mr: 1 }} />
//             <Typography variant="body2">Generating feedback...</Typography>
//           </Box>
//         ) : (
//           <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
//             {animatedFeedback}
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default AIInputFeedback;
