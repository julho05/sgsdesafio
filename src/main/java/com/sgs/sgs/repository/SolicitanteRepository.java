package com.sgs.sgs.repository;

import com.sgs.sgs.entity.Solicitante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitanteRepository extends JpaRepository<Solicitante, Long> {
}