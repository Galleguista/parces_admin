import { useState, useEffect } from 'react';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const useGroupsSection = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const TIPO_CONVERSACION_GRUPO = "ef290e87-68e1-4125-b83e-2908adc0027c";

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await instance.get('/grupos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchGroupMembers = async (groupId) => {
    setIsLoadingMembers(true);
    try {
      const response = await instance.get(`/grupos/${groupId}/miembros`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGroupMembers(response.data);
    } catch (error) {
      setError('Error al cargar los miembros del grupo.');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleOpenGroup = (group) => {
    setSelectedGroup(group);
    fetchGroupMembers(group.grupo_id);
  };

  const handleCloseGroup = () => {
    setSelectedGroup(null);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Ingresa un término de búsqueda.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get(`/usuarios/search`, {
        params: { query: searchQuery },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.length === 0) {
        setError('No se encontraron usuarios con ese término.');
      }
      setSearchResults(response.data);
    } catch (error) {
      setError('Error al buscar usuarios. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (groupId, userId) => {
    try {
      await instance.post(
        `/grupos/${groupId}/miembro`,
        { usuario_id: userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccessMessage('Miembro añadido exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
      // Actualizar lista de miembros
      setGroupMembers((prev) => [...prev, searchResults.find((user) => user.usuario_id === userId)]);
    } catch (error) {
      setError('No se pudo añadir al miembro. Verifica tus permisos.');
    }
  };

  const handleRemoveMember = async (groupId, userId) => {
    try {
      await instance.delete(`/grupos/${groupId}/miembro/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccessMessage('Miembro eliminado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
      // Actualizar lista de miembros
      setGroupMembers((prev) => prev.filter((member) => member.usuario_id !== userId));
    } catch (error) {
      setError('No se pudo eliminar al miembro. Verifica tus permisos.');
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName || !newGroupDescription) {
      setError('Por favor completa todos los campos para crear el grupo.');
      return;
    }
    try {
      const response = await instance.post(
        '/grupos',
        {
          nombre: newGroupName,
          descripcion: newGroupDescription,
          userIds: [], // Añadir usuarios iniciales si es necesario
          tipo_conversacion_id: TIPO_CONVERSACION_GRUPO,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setGroups((prevGroups) => [...prevGroups, response.data]);
      setSuccessMessage('Grupo creado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsCreateDialogOpen(false);
      setNewGroupName('');
      setNewGroupDescription('');
    } catch (error) {
      setError('Error al crear el grupo. Inténtalo nuevamente.');
    }
  };

  return {
    groups,
    selectedGroup,
    tabValue,
    isCreateDialogOpen,
    newGroupName,
    newGroupDescription,
    usuarios,
    searchQuery,
    searchResults,
    isLoading,
    error,
    successMessage,
    groupMembers,
    isLoadingMembers,
    handleOpenGroup,
    handleCloseGroup,
    handleTabChange,
    handleSearch,
    handleAddMember,
    handleRemoveMember,
    handleCreateGroup,
    setNewGroupName,
    setNewGroupDescription,
    setIsCreateDialogOpen,
    setSearchQuery,
  };
};

export default useGroupsSection;
