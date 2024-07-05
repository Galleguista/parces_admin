import React, { useState, useRef } from 'react';
import { Container, Box, Paper, Tabs, Tab, IconButton, Typography, Avatar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExploreIcon from '@mui/icons-material/Explore';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';

import ProfileSection from '../sections/profile';
import ProjectsSection from '../sections/projects';
import MessagesSection from '../sections/messages';
//import ActivitiesSection from './sections/activities';
import GroupsSection from '../sections/groups';
import ResourcesSection from '../sections/resources';
import AchievementsSection from '../sections/achievements';
import ForumSection from '../sections/forum';
import EventsSection from '../sections/events';

const sections = [
  { id: 'profile', icon: <AssignmentIcon />, label: 'Profile' },
  { id: 'projects', icon: <ExploreIcon />, label: 'Projects' },
  { id: 'messages', icon: <MailIcon />, label: 'Messages' },
  { id: 'groups', icon: <GroupIcon />, label: 'Groups' },
  { id: 'resources', icon: <SchoolIcon />, label: 'Resources' },
  { id: 'achievements', icon: <StarIcon />, label: 'Achievements' },
  { id: 'forum', icon: <ForumIcon />, label: 'Forum' },
  { id: 'events', icon: <EventIcon />, label: 'Events' },
];

const CommunityPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const tabsRef = useRef(null);

  const handleSectionChange = (event, newValue) => {
    setActiveSection(newValue);
  };

  const scrollTabs = (direction) => {
    const currentScroll = tabsRef.current.scrollLeft;
    const newScroll = direction === 'left' ? currentScroll - 200 : currentScroll + 200;
    tabsRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ bgcolor: '#f0f2f5', py: 3 }}>
      <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden', mb: 3 }}>
        <img
          src="https://via.placeholder.com/1200x300"
          alt="Banner"
          style={{ width: '100%', height: 'auto', borderRadius: '16px 16px 0 0' }}
        />
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: -6 }}>
          <Avatar
            src="https://via.placeholder.com/100"
            alt="Profile Picture"
            sx={{ width: 100, height: 100, border: '5px solid white', borderRadius: '50%' }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>Brian Hughes</Typography>
          <Typography variant="body1" color="textSecondary">London, UK</Typography>
          <Typography variant="body2" color="textSecondary">200k Followers | 1.2k Following</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1 }}>
          <IconButton onClick={() => scrollTabs('left')}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }} ref={tabsRef}>
            <Tabs
              value={activeSection}
              onChange={handleSectionChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="sections navigation"
              allowScrollButtonsMobile
            >
              {sections.map((section) => (
                <Tab key={section.id} label={section.label} icon={section.icon} value={section.id} />
              ))}
            </Tabs>
          </Box>
          <IconButton onClick={() => scrollTabs('right')}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Paper>

      {activeSection === 'profile' && <ProfileSection />}
      {activeSection === 'projects' && <ProjectsSection />}
      {activeSection === 'messages' && <MessagesSection />}
      {activeSection === 'groups' && <GroupsSection />}
      {activeSection === 'resources' && <ResourcesSection />}
      {activeSection === 'achievements' && <AchievementsSection />}
      {activeSection === 'forum' && <ForumSection />}
      {activeSection === 'events' && <EventsSection />}
    </Container>
  );
};

export default CommunityPage;



